require('dotenv').config();
const express = require('express'), mongoose = require('mongoose'), cors = require('cors'), path = require('path'), crypto = require('crypto');
const Room = require('./model/Room'), Booking = require('./model/Booking'), Customer = require('./model/Customer'), Service = require('./model/Service'), User = require('./model/User'), Setting = require('./model/Setting'), Promotion = require('./model/Promotion'), PaymentTransaction = require('./model/PaymentTransaction');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const bad = (r, e, c = 400) => r.status(c).json({
    error: e.message || String(e)
}), hash = (p, s) => crypto.scryptSync(p, s, 64).toString('hex');
async function seed() {
    const adminUser = String(process.env.ADMIN_USER || 'anhkhoa').trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || '123');
    let admin = await User.findOne({
        role: 'admin'
    });
    const salt = crypto.randomBytes(16).toString('hex');
    if (admin) {
        admin.name = 'Quản trị viên';
        admin.username = adminUser;
        admin.salt = salt;
        admin.passwordHash = hash(adminPassword, salt);
        admin.active = true;
        admin.token = '';
        await admin.save();
    }
    else {
        await User.create({
            name: 'Quản trị viên', username: adminUser, passwordHash: hash(adminPassword, salt), salt, role: 'admin', active: true
        });
    }
    console.log(`👤 Admin đã đồng bộ từ .env: ${adminUser}`);
    await Setting.findOneAndUpdate({
        key: 'hotel'
    }, {
        $setOnInsert: {
            key: 'hotel'
        }
    }, {
        upsert: true
    });
    if (await Service.countDocuments() === 0) {
        await Service.insertMany([
            { name: 'Bữa sáng', price: 80000, unit: 'suất', active: true },
            { name: 'Đưa đón sân bay', price: 250000, unit: 'chuyến', active: true },
            { name: 'Giặt ủi', price: 50000, unit: 'kg', active: true },
            { name: 'Giường phụ', price: 200000, unit: 'đêm', active: true },
            { name: 'Minibar', price: 60000, unit: 'lần', active: true },
            { name: 'Spa / massage', price: 300000, unit: 'buổi', active: true },
            { name: 'Thuê xe máy', price: 150000, unit: 'ngày', active: true },
            { name: 'Đậu xe', price: 50000, unit: 'ngày', active: true },
            { name: 'Trả phòng muộn', price: 100000, unit: 'giờ', active: true },
            { name: 'Dọn phòng theo yêu cầu', price: 0, unit: 'lần', active: true }
        ]);
        console.log('🛎️ Đã tạo danh sách dịch vụ khách sạn mẫu');
    }
    if (await Promotion.countDocuments() === 0) {
        const start = new Date();
        const expiry = new Date(Date.now() + 60 * 86400000);
        await Promotion.insertMany([
            { code: 'STAY10', title: 'Ưu đãi đặt phòng trực tiếp', description: 'Giảm 10% cho đơn phòng từ 500.000₫.', type: 'percent', value: 10, maxDiscount: 300000, minAmount: 500000, startsAt: start, expiresAt: expiry, usageLimit: 500, active: true },
            { code: 'WELCOME50', title: 'Ưu đãi khách mới', description: 'Giảm 50.000₫ cho kỳ nghỉ đầu tiên.', type: 'fixed', value: 50000, minAmount: 700000, startsAt: start, expiresAt: expiry, usageLimit: 300, active: true }
        ]);
        console.log('🎁 Đã tạo mã khuyến mãi mẫu STAY10 và WELCOME50');
    }
}
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homestay_db').then(async () => {
    console.log('✅ MongoDB connected');
    await seed();
}).catch(e => console.error('❌ MongoDB:', e.message));
app.post('/api/auth/login', async (q, r) => {
    try {
        let u = await User.findOne({
            username: String(q.body.username || '').toLowerCase(), active: true
        });
        if (!u || hash(String(q.body.password || ''), u.salt) !== u.passwordHash)
            return r.status(401).json({
                error: 'Sai tài khoản hoặc mật khẩu'
            });
        u.token = crypto.randomBytes(32).toString('hex');
        await u.save();
        r.json({
            token: u.token, user: {
                id: u._id, name: u.name, username: u.username, role: u.role
            }
        });
    }
    catch (e) {
        bad(r, e);
    }
});
const auth = async (q, r, n) => {
    let t = (q.headers.authorization || '').replace(/^Bearer\s+/, '');
    let u = t && await User.findOne({
        token: t, active: true
    });
    if (!u)
        return r.status(401).json({
            error: 'Vui lòng đăng nhập'
        });
    q.user = u;
    n();
};

// Khóa phòng ở MongoDB để các yêu cầu đặt đồng thời (kể cả nhiều tiến trình)
// phải lần lượt kiểm tra lịch trước khi tạo booking.
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function acquireRoomLock(roomId) {
    const token = crypto.randomBytes(16).toString('hex');
    const deadline = Date.now() + 7000;
    while (Date.now() < deadline) {
        const now = new Date();
        const locked = await Room.findOneAndUpdate({
            _id: roomId,
            $or: [
                { bookingLockUntil: { $lte: now } },
                { bookingLockUntil: { $exists: false } },
                { bookingLockUntil: null }
            ]
        }, {
            $set: { bookingLockToken: token, bookingLockUntil: new Date(Date.now() + 15000) }
        }, { new: true });
        if (locked) return token;
        await wait(100);
    }
    const error = new Error('Phòng đang được xử lý đặt bởi yêu cầu khác. Vui lòng thử lại.');
    error.status = 409;
    throw error;
}
async function releaseRoomLock(roomId, token) {
    if (!roomId || !token) return;
    await Room.updateOne({ _id: roomId, bookingLockToken: token }, {
        $set: { bookingLockToken: '', bookingLockUntil: new Date(0) }
    });
}

function roleGuard(q, r, next) {
    const role = q.user.role;
    const method = q.method;
    const pathName = q.path;
    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isReceptionist = role === 'receptionist';
    const isHousekeeping = role === 'housekeeping';
    if (isAdmin) return next();
    if (pathName === '/users' || pathName.startsWith('/users/'))
        return r.status(403).json({ error: 'Chỉ quản trị viên mới được quản lý tài khoản.' });
    if (isHousekeeping) {
        const allowed = (method === 'GET' && ['/me', '/rooms'].includes(pathName)) ||
            (method === 'POST' && pathName === '/logout') ||
            (method === 'POST' && /^\/rooms\/[^/]+\/housekeeping$/.test(pathName));
        if (allowed) return next();
        return r.status(403).json({ error: 'Tài khoản buồng phòng chỉ được xem phòng và cập nhật vệ sinh.' });
    }
    if (pathName === '/settings' && method !== 'GET')
        return r.status(403).json({ error: 'Chỉ quản trị viên mới được thay đổi cài đặt khách sạn.' });
    if (pathName.startsWith('/promotions') && !['GET'].includes(method) && !isManager)
        return r.status(403).json({ error: 'Chỉ quản lý hoặc quản trị viên được sửa mã khuyến mãi.' });
    if (pathName.startsWith('/rooms')) {
        if (method === 'GET') return next();
        if (isManager && method !== 'DELETE') return next();
        return r.status(403).json({ error: 'Bạn không có quyền thay đổi danh mục phòng.' });
    }
    if (pathName.startsWith('/services')) {
        if (method === 'GET') return next();
        if (isManager) return next();
        return r.status(403).json({ error: 'Chỉ quản lý mới được thay đổi danh mục dịch vụ.' });
    }
    if (pathName.startsWith('/customers')) {
        if (method === 'GET' || (isManager && ['POST', 'PUT'].includes(method))) return next();
        return r.status(403).json({ error: 'Bạn không có quyền thay đổi hồ sơ khách hàng.' });
    }
    if (pathName === '/stats' || pathName === '/bookings' || pathName.startsWith('/bookings/')) {
        if (isManager || isReceptionist) return next();
    }
    return next();
}

// API công khai dành cho website đặt phòng của khách
app.get('/api/public/settings', async (q, r) => {
    const x = await Setting.findOne({ key: 'hotel' }).lean();
    r.json(x || {});
});
app.get('/api/public/rooms', async (q, r) => {
    const rooms = await Room.find({ isAvailable: true, status: 'available' })
        .sort({ price: 1 })
        .lean();
    r.json(rooms);
});
app.get('/api/public/available', async (q, r) => {
    try {
        const start = new Date(q.query.checkIn);
        const end = new Date(q.query.checkOut);
        if (!q.query.checkIn || !q.query.checkOut || end <= start) {
            return r.status(400).json({ error: 'Vui lòng chọn ngày hợp lệ' });
        }
        const rooms = await Room.find({
            isAvailable: true,
            status: 'available'
        }).sort({ price: 1 }).lean();
        const used = await Booking.find({
            status: { $in: ['confirmed', 'checked_in'] },
            checkInDate: { $lt: end },
            checkOutDate: { $gt: start }
        }).select('roomId').lean();
        const ids = new Set(used.map(x => String(x.roomId)));
        r.json(rooms.filter(x => !ids.has(String(x._id))));
    }
    catch (e) {
        bad(r, e, 500);
    }
});
function calculatePromotion(promo, amount) {
    if (!promo || !promo.active)
        return { valid: false, error: 'Mã khuyến mãi không khả dụng' };
    const now = new Date();
    if (now < new Date(promo.startsAt) || now > new Date(promo.expiresAt))
        return { valid: false, error: 'Mã khuyến mãi đã hết hạn hoặc chưa bắt đầu' };
    if (promo.usedCount >= promo.usageLimit)
        return { valid: false, error: 'Mã khuyến mãi đã hết lượt sử dụng' };
    if (amount < Number(promo.minAmount || 0))
        return { valid: false, error: 'Đơn chưa đạt giá trị tối thiểu của mã' };
    let discount = promo.type === 'percent' ? amount * promo.value / 100 : promo.value;
    if (promo.type === 'percent' && promo.maxDiscount > 0)
        discount = Math.min(discount, promo.maxDiscount);
    discount = Math.min(Math.round(discount), amount);
    return { valid: true, discount, promo };
}
// SePay webhook: chỉ tự xác nhận khi đã nhận sự kiện tiền vào, đúng tài khoản,
// đúng mã booking và số tiền còn phải trả. Không bao giờ tin trạng thái từ trình duyệt.
function safeEqual(a, b) {
    const aa = Buffer.from(String(a || ''));
    const bb = Buffer.from(String(b || ''));
    return aa.length === bb.length && aa.length > 0 && crypto.timingSafeEqual(aa, bb);
}

app.post('/api/payments/sepay-webhook', async (q, r) => {
    const configuredKey = process.env.SEPAY_WEBHOOK_API_KEY;
    const authorization = String(q.headers.authorization || '');

    if (
        !configuredKey ||
        !safeEqual(authorization, 'Apikey ' + configuredKey)
    ) {
        return r.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const data = q.body || {};
        const txId = String(data.id || '').trim();
        const transferType = String(data.transferType || '').toLowerCase();
        const accountNumber = String(data.accountNumber || '').replace(/\s+/g, '');
        const content = String(data.content || data.code || '').toUpperCase();
        const amount = Number(data.transferAmount || 0);

        if (
            !txId ||
            transferType !== 'in' ||
            accountNumber !== String(process.env.BANK_ACCOUNT || '').replace(/\s+/g, '') ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return r.json({ success: true, ignored: true });
        }

        // Booking code chỉ có dạng BK + 6 ký tự.
        // Ví dụ: STAY BKAB4AC3-CHUYEN TIEN
        const match = content.match(/\b(STAY\s+)?(BK[A-Z0-9]{6})\b/);

        if (!match) {
            return r.json({
                success: true,
                ignored: true,
                reason: 'No valid booking code'
            });
        }

        const bookingCode = match[2];

        // Tìm giao dịch đã lưu trước đó.
        // Nếu giao dịch đã thanh toán thì không xử lý lần hai.
        let tx = await PaymentTransaction.findOne({
            transactionId: txId
        });

        if (tx && tx.result === 'paid') {
            return r.json({
                success: true,
                duplicate: true,
                paid: true,
                bookingCode: tx.bookingCode
            });
        }

        // Tạo giao dịch mới hoặc sửa thông tin giao dịch lỗi đã lưu.
        if (!tx) {
            try {
                tx = await PaymentTransaction.create({
                    transactionId: txId,
                    bookingCode,
                    amount,
                    accountNumber,
                    content,
                    receivedAt: data.transactionDate
                        ? new Date(data.transactionDate)
                        : new Date()
                });
            } catch (e) {
                if (e && e.code === 11000) {
                    // Có thể webhook khác vừa tạo giao dịch.
                    tx = await PaymentTransaction.findOne({
                        transactionId: txId
                    });

                    if (!tx) throw e;

                    if (tx.result === 'paid') {
                        return r.json({
                            success: true,
                            duplicate: true,
                            paid: true,
                            bookingCode: tx.bookingCode
                        });
                    }
                } else {
                    throw e;
                }
            }
        }

        // Cập nhật mã đúng cho giao dịch cũ bị nhận sai mã.
        tx.bookingCode = bookingCode;
        tx.amount = amount;
        tx.accountNumber = accountNumber;
        tx.content = content;

        const b = await Booking.findOne({
            bookingCode,
            paymentMethod: 'transfer',
            status: { $ne: 'cancelled' }
        });

        if (!b) {
            tx.result = 'booking_not_found';
            await tx.save();

            return r.json({
                success: true,
                ignored: true,
                reason: 'Booking not found',
                bookingCode
            });
        }

        const outstanding = Math.max(
            0,
            Number(b.totalAmount || 0) - Number(b.paidAmount || 0)
        );

        if (outstanding <= 0) {
            tx.result = 'already_paid';
            await tx.save();

            return r.json({
                success: true,
                ignored: true,
                reason: 'Booking already paid',
                bookingCode
            });
        }

        if (amount < outstanding) {
            tx.result = 'underpayment';
            await tx.save();

            return r.json({
                success: true,
                ignored: true,
                reason: 'Underpayment',
                outstanding
            });
        }

        b.paidAmount = Number(b.totalAmount || 0);
        b.paymentStatus = 'paid';
        b.notes = [
            b.notes,
            `[SePay xác nhận giao dịch ${txId}, ${amount} VND, ${new Date().toISOString()}]`
        ].filter(Boolean).join('\n');

        await b.save();

        tx.result = 'paid';
        await tx.save();

        return r.json({
            success: true,
            paid: true,
            bookingCode
        });
    } catch (e) {
        console.error('SePay webhook error:', e);
        return r.status(500).json({
            success: false,
            message: 'Webhook processing failed'
        });
    }
});


function makeQrUrl(amount, bookingCode) {
    const bank = process.env.BANK_ID;
    const account = process.env.BANK_ACCOUNT;
    const accountName = process.env.BANK_NAME;
    if (!bank || !account)
        return '';
    const addInfo = encodeURIComponent('STAY ' + bookingCode);
    const name = accountName ? '&accountName=' + encodeURIComponent(accountName) : '';
    return `https://img.vietqr.io/image/${encodeURIComponent(bank)}-${encodeURIComponent(account)}-compact2.png?amount=${Math.round(amount)}&addInfo=${addInfo}${name}`;
}
app.get('/api/public/promotions', async (q, r) => {
    try {
        const now = new Date();
        const promos = await Promotion.find({ active: true, startsAt: { $lte: now }, expiresAt: { $gte: now }, $expr: { $lt: ['$usedCount', '$usageLimit'] } })
            .select('code title description type value maxDiscount minAmount expiresAt').sort({ createdAt: -1 }).lean();
        r.json(promos);
    }
    catch (e) {
        bad(r, e, 500);
    }
});
app.post('/api/public/promotions/validate', async (q, r) => {
    try {
        const code = String(q.body.code || '').trim().toUpperCase();
        const amount = Number(q.body.amount || 0);
        const promo = await Promotion.findOne({ code }).lean();
        const result = calculatePromotion(promo, amount);
        if (!result.valid)
            return r.status(400).json({ error: result.error });
        r.json({ ok: true, code: promo.code, title: promo.title, discount: result.discount, totalAmount: Math.max(0, amount - result.discount) });
    }
    catch (e) {
        bad(r, e, 500);
    }
});
app.post('/api/public/bookings', async (q, r) => {
    let roomLockToken = '';
    let roomIdForLock = '';
    try {
        const {
            customerName, customerPhone, customerEmail = '', roomId,
            checkInDate, checkOutDate, guests = 1, notes = '',
            promoCode = '', paymentMethod = 'cash'
        } = q.body;
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const normalizedPhone = String(customerPhone || '').replace(/\s+/g, '');
        if (!customerName || !normalizedPhone || !roomId || !checkInDate || !checkOutDate ||
            Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start < today || end <= start) {
            return r.status(400).json({ error: 'Thông tin đặt phòng chưa hợp lệ. Ngày nhận phòng không được ở quá khứ.' });
        }
        if (!['cash', 'transfer'].includes(paymentMethod))
            return r.status(400).json({ error: 'Phương thức thanh toán không hợp lệ' });
        if (!Number.isInteger(Number(guests)) || Number(guests) < 1)
            return r.status(400).json({ error: 'Số khách không hợp lệ.' });

        roomIdForLock = roomId;
        roomLockToken = await acquireRoomLock(roomId);
        const room = await Room.findById(roomId);
        if (!room || !room.isAvailable || room.status !== 'available')
            return r.status(400).json({ error: 'Phòng không khả dụng hoặc đang dọn/bảo trì.' });
        if (Number(guests) > Number(room.capacity || 2))
            return r.status(400).json({ error: 'Số khách vượt quá sức chứa của phòng.' });

        const overlap = await Booking.exists({
            roomId,
            status: { $in: ['confirmed', 'checked_in'] },
            checkInDate: { $lt: end },
            checkOutDate: { $gt: start }
        });
        if (overlap)
            return r.status(409).json({ error: 'Phòng vừa được khách khác đặt trong khoảng ngày này. Vui lòng chọn phòng khác.' });

        const nights = Math.max(1, Math.ceil((end - start) / 86400000));
        const roomAmount = Number(room.price) * nights;
        let discount = 0;
        let validPromo = null;
        if (String(promoCode).trim()) {
            validPromo = await Promotion.findOne({ code: String(promoCode).trim().toUpperCase() });
            const result = calculatePromotion(validPromo, roomAmount);
            if (!result.valid) return r.status(400).json({ error: result.error });
            discount = result.discount;
        }

        let customer = await Customer.findOne({ phone: normalizedPhone });
        if (!customer) {
            customer = await Customer.create({ name: customerName, phone: normalizedPhone, email: customerEmail });
        } else {
            customer.name = customerName;
            if (customerEmail) customer.email = customerEmail;
            await customer.save();
        }

        const bookingId = new mongoose.Types.ObjectId();
        const bookingCode = 'BK' + String(bookingId).slice(-6).toUpperCase();
        const booking = await Booking.create({
            _id: bookingId, bookingCode,
            customerId: customer._id, customerName, customerPhone: normalizedPhone, customerEmail,
            roomId, checkInDate: start, checkOutDate: end, guests: Number(guests),
            notes: '[Website] ' + String(notes || '').slice(0, 1000),
            roomAmount, discount, promoCode: validPromo ? validPromo.code : '',
            totalAmount: Math.max(0, roomAmount - discount), paymentMethod,
            paymentStatus: paymentMethod === 'transfer' ? 'pending' : 'unpaid',
            status: 'confirmed'
        });
        if (validPromo) {
            const promoUpdate = await Promotion.updateOne({
                _id: validPromo._id, active: true, usedCount: { $lt: validPromo.usageLimit }
            }, { $inc: { usedCount: 1 } });
            if (!promoUpdate.modifiedCount) {
                await Booking.deleteOne({ _id: booking._id });
                return r.status(409).json({ error: 'Mã khuyến mãi vừa hết lượt sử dụng. Vui lòng thử mã khác.' });
            }
        }
        r.status(201).json({
            ok: true, bookingCode, totalAmount: booking.totalAmount,
            discount: booking.discount, paymentMethod: booking.paymentMethod,
            paymentStatus: booking.paymentStatus,
            qrUrl: paymentMethod === 'transfer' ? makeQrUrl(booking.totalAmount, bookingCode) : ''
        });
    } catch (e) {
        bad(r, e, e.status || 400);
    } finally {
        await releaseRoomLock(roomIdForLock, roomLockToken).catch(() => {});
    }
});
// Khách có thể tra cứu đơn bằng mã booking và số điện thoại đã đăng ký.
app.post('/api/public/bookings/lookup', async (q, r) => {
    try {
        const code = String(q.body.bookingCode || '').trim().toUpperCase();
        const phone = String(q.body.customerPhone || '').replace(/\s+/g, '');
        if (!code || !phone)
            return r.status(400).json({ error: 'Vui lòng nhập mã đặt phòng và số điện thoại.' });
        const b = await Booking.findOne({ bookingCode: code, customerPhone: phone })
            .populate('roomId', 'roomNumber type price')
            .select('bookingCode customerName customerPhone customerEmail roomId checkInDate checkOutDate guests roomAmount serviceAmount discount totalAmount paidAmount paymentMethod paymentStatus status promoCode createdAt')
            .lean();
        if (!b)
            return r.status(404).json({ error: 'Không tìm thấy đơn. Hãy kiểm tra mã đặt phòng và số điện thoại.' });
        r.json({ ...b, nights: Math.max(1, Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000)), remainingAmount: Math.max(0, b.totalAmount - (b.paidAmount || 0)), cancellationPolicy: 'Hủy trước ngày nhận phòng từ 3 ngày: hoàn 100% khoản đã thanh toán; từ 1 đến dưới 3 ngày: hoàn 50%; dưới 24 giờ: không hoàn. Việc hoàn tiền được khách sạn xử lý thủ công.' });
    }
    catch (e) {
        bad(r, e, 500);
    }
});
app.post('/api/public/bookings/cancel', async (q, r) => {
    try {
        const code = String(q.body.bookingCode || '').trim().toUpperCase();
        const phone = String(q.body.customerPhone || '').replace(/\s+/g, '');
        if (!code || !phone)
            return r.status(400).json({ error: 'Vui lòng nhập mã đặt phòng và số điện thoại.' });
        const b = await Booking.findOne({ bookingCode: code, customerPhone: phone });
        if (!b)
            return r.status(404).json({ error: 'Không tìm thấy đơn đặt phòng.' });
        if (b.status !== 'confirmed')
            return r.status(400).json({ error: 'Chỉ có thể yêu cầu hủy đơn đang ở trạng thái đã xác nhận.' });
        const hoursUntilCheckIn = (new Date(b.checkInDate) - Date.now()) / 3600000;
        const refundRate = hoursUntilCheckIn >= 72 ? 1 : hoursUntilCheckIn >= 24 ? 0.5 : 0;
        const refund = Math.round(Math.max(0, Number(b.paidAmount || 0)) * refundRate);
        b.status = 'cancelled';
        b.refundAmount = refund;
        if (refund > 0)
            b.paymentStatus = refund >= Number(b.paidAmount || 0) ? 'refunded' : 'partially_refunded';
        await b.save();
        r.json({ ok: true, bookingCode: b.bookingCode, status: b.status, refundAmount: refund, message: 'Đã ghi nhận yêu cầu hủy. Nếu có khoản hoàn, lễ tân sẽ liên hệ để xử lý thủ công.' });
    }
    catch (e) {
        bad(r, e, 500);
    }
});
app.use('/api', auth, roleGuard);
app.get('/api/promotions', async (q, r) => {
    try {
        r.json(await Promotion.find().sort({ createdAt: -1 }).lean());
    }
    catch (e) {
        bad(r, e, 500);
    }
});
app.post('/api/promotions', async (q, r) => {
    try {
        const body = { ...q.body, code: String(q.body.code || '').trim().toUpperCase() };
        r.status(201).json(await Promotion.create(body));
    }
    catch (e) {
        bad(r, e);
    }
});
app.put('/api/promotions/:id', async (q, r) => {
    try {
        const body = { ...q.body };
        if (body.code)
            body.code = String(body.code).trim().toUpperCase();
        r.json(await Promotion.findByIdAndUpdate(q.params.id, body, { new: true, runValidators: true }));
    }
    catch (e) {
        bad(r, e);
    }
});
app.delete('/api/promotions/:id', async (q, r) => {
    try {
        await Promotion.findByIdAndDelete(q.params.id);
        r.json({ ok: true });
    }
    catch (e) {
        bad(r, e);
    }
});
// Quản lý tài khoản nhân viên: chỉ admin truy cập được (được chặn thêm ở roleGuard).
app.get('/api/users', async (q, r) => {
    try { r.json(await User.find().select('-passwordHash -salt -token').sort({ createdAt: -1 }).lean()); }
    catch (e) { bad(r, e, 500); }
});
app.post('/api/users', async (q, r) => {
    try {
        const name = String(q.body.name || '').trim();
        const username = String(q.body.username || '').trim().toLowerCase();
        const password = String(q.body.password || '');
        const role = String(q.body.role || 'receptionist');
        if (!name || !username || password.length < 8)
            return r.status(400).json({ error: 'Nhập họ tên, tài khoản và mật khẩu tối thiểu 8 ký tự.' });
        if (!['manager', 'receptionist', 'housekeeping'].includes(role))
            return r.status(400).json({ error: 'Vai trò nhân viên không hợp lệ.' });
        const salt = crypto.randomBytes(16).toString('hex');
        const user = await User.create({ name, username, role, salt, passwordHash: hash(password, salt), active: true });
        r.status(201).json({ _id: user._id, name: user.name, username: user.username, role: user.role, active: user.active });
    } catch (e) { bad(r, e, e.code === 11000 ? 409 : 400); }
});
app.put('/api/users/:id', async (q, r) => {
    try {
        const user = await User.findById(q.params.id);
        if (!user) return r.status(404).json({ error: 'Không tìm thấy tài khoản.' });
        if (String(user._id) === String(q.user._id) && q.body.active === false)
            return r.status(400).json({ error: 'Không thể tự khóa tài khoản đang đăng nhập.' });
        if (q.body.name !== undefined) user.name = String(q.body.name).trim();
        if (q.body.role !== undefined) {
            if (user.role === 'admin' || !['manager', 'receptionist', 'housekeeping'].includes(q.body.role))
                return r.status(400).json({ error: 'Không thể đổi vai trò quản trị viên hoặc vai trò không hợp lệ.' });
            user.role = q.body.role;
        }
        if (q.body.active !== undefined) user.active = Boolean(q.body.active);
        if (q.body.password) {
            if (String(q.body.password).length < 8) return r.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
            user.salt = crypto.randomBytes(16).toString('hex');
            user.passwordHash = hash(String(q.body.password), user.salt);
            user.token = '';
        }
        await user.save();
        r.json({ _id: user._id, name: user.name, username: user.username, role: user.role, active: user.active });
    } catch (e) { bad(r, e, 400); }
});
app.post('/api/rooms/:id/housekeeping', async (q, r) => {
    try {
        const room = await Room.findById(q.params.id);
        if (!room) return r.status(404).json({ error: 'Không tìm thấy phòng.' });
        if (room.status !== 'cleaning') return r.status(400).json({ error: 'Phòng không ở trạng thái cần dọn.' });
        room.status = 'available';
        room.isAvailable = true;
        await room.save();
        r.json({ ok: true, room });
    } catch (e) { bad(r, e, 500); }
});

app.get('/api/me', (q, r) => r.json({
    name: q.user.name, username: q.user.username, role: q.user.role
}));
app.post('/api/logout', async (q, r) => {
    q.user.token = '';
    await q.user.save();
    r.json({
        ok: true
    });
});
app.get('/api/settings', async (q, r) => r.json(await Setting.findOne({
    key: 'hotel'
}).lean()));
app.put('/api/settings', async (q, r) => {
    try {
        r.json(await Setting.findOneAndUpdate({
            key: 'hotel'
        }, q.body, {
            new: true, upsert: true, runValidators: true
        }));
    }
    catch (e) {
        bad(r, e);
    }
});
app.get('/api/rooms', async (q, r) => {
    try {
        const rooms = await Room.find().sort({ roomNumber: 1 }).lean();
        const activeBookings = await Booking.find({
            status: { $in: ['confirmed', 'checked_in'] },
            checkOutDate: { $gt: new Date() }
        }).select('roomId status checkInDate checkOutDate').lean();
        const stateByRoom = new Map();
        for (const booking of activeBookings) {
            const id = String(booking.roomId);
            const current = stateByRoom.get(id);
            if (booking.status === 'checked_in') stateByRoom.set(id, 'occupied');
            else if (!current) stateByRoom.set(id, 'booked');
        }
        r.json(rooms.map(room => ({
            ...room,
            displayStatus: ['cleaning', 'maintenance'].includes(room.status)
                ? room.status
                : (stateByRoom.get(String(room._id)) || room.status)
        })));
    } catch (e) { bad(r, e, 500); }
});
app.post('/api/rooms', async (q, r) => {
    try {
        r.status(201).json(await Room.create(q.body));
    }
    catch (e) {
        bad(r, e);
    }
});
app.put('/api/rooms/:id', async (q, r) => {
    try {
        r.json(await Room.findByIdAndUpdate(q.params.id, q.body, {
            new: true, runValidators: true
        }));
    }
    catch (e) {
        bad(r, e);
    }
});
app.delete('/api/rooms/:id', async (q, r) => {
    try {
        if (await Booking.exists({
            roomId: q.params.id, status: {
                $in: ['confirmed', 'checked_in']
            }
        }))
            return r.status(409).json({
                error: 'Phòng đang có booking hoạt động'
            });
        await Room.findByIdAndDelete(q.params.id);
        r.json({
            ok: true
        });
    }
    catch (e) {
        bad(r, e);
    }
});
app.get('/api/rooms/available', async (q, r) => {
    try {
        let s = new Date(q.query.checkIn), e = new Date(q.query.checkOut);
        if (!q.query.checkIn || !q.query.checkOut || e <= s)
            return r.status(400).json({
                error: 'Khoảng ngày không hợp lệ'
            });
        let rooms = await Room.find({
            isAvailable: true, status: 'available'
        }).lean(), used = await Booking.find({
            status: {
                $in: ['confirmed', 'checked_in']
            }, checkInDate: {
                $lt: e
            }, checkOutDate: {
                $gt: s
            }
        }).select('roomId').lean(), ids = new Set(used.map(x => String(x.roomId)));
        r.json(rooms.filter(x => !ids.has(String(x._id))));
    }
    catch (e) {
        bad(r, e, 500);
    }
});
app.get('/api/customers', async (q, r) => r.json(await Customer.find().sort({
    createdAt: -1
}).lean()));
app.post('/api/customers', async (q, r) => {
    try {
        r.status(201).json(await Customer.create(q.body));
    }
    catch (e) {
        bad(r, e);
    }
});
app.put('/api/customers/:id', async (q, r) => {
    try {
        r.json(await Customer.findByIdAndUpdate(q.params.id, q.body, {
            new: true, runValidators: true
        }));
    }
    catch (e) {
        bad(r, e);
    }
});
app.get('/api/services', async (q, r) => r.json(await Service.find().sort({
    name: 1
}).lean()));
app.post('/api/services', async (q, r) => {
    try {
        r.status(201).json(await Service.create(q.body));
    }
    catch (e) {
        bad(r, e);
    }
});
app.put('/api/services/:id', async (q, r) => {
    try {
        r.json(await Service.findByIdAndUpdate(q.params.id, q.body, {
            new: true, runValidators: true
        }));
    }
    catch (e) {
        bad(r, e);
    }
});
app.delete('/api/services/:id', async (q, r) => {
    try {
        await Service.findByIdAndDelete(q.params.id);
        r.json({
            ok: true
        });
    }
    catch (e) {
        bad(r, e);
    }
});
app.get('/api/bookings', async (q, r) => r.json(await Booking.find().populate('roomId').populate('customerId').sort({
    createdAt: -1
}).lean()));
app.post('/api/bookings', async (q, r) => {
    let lockToken = '';
    let lockRoomId = '';
    try {
        const {
            customerName, customerPhone, customerEmail = '', idNumber = '', roomId,
            checkInDate, checkOutDate, seasonFactor = 1, deposit = 0,
            guests = 1, notes = ''
        } = q.body;
        const start = new Date(checkInDate), end = new Date(checkOutDate);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (!customerName || !customerPhone || !roomId || !checkInDate || !checkOutDate ||
            Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start < today || end <= start)
            return r.status(400).json({ error: 'Thông tin khách/ngày đặt phòng không hợp lệ.' });
        lockRoomId = roomId;
        lockToken = await acquireRoomLock(roomId);
        const room = await Room.findById(roomId);
        if (!room || !room.isAvailable || room.status !== 'available')
            return r.status(400).json({ error: 'Phòng không khả dụng, đang dọn hoặc bảo trì.' });
        if (Number(guests) > Number(room.capacity || 2))
            return r.status(400).json({ error: 'Số khách vượt sức chứa phòng.' });
        if (await Booking.exists({ roomId, status: { $in: ['confirmed', 'checked_in'] }, checkInDate: { $lt: end }, checkOutDate: { $gt: start } }))
            return r.status(409).json({ error: 'Phòng đã được đặt trong khoảng ngày này.' });
        const phone = String(customerPhone).replace(/\s+/g, '');
        const customer = await Customer.findOneAndUpdate({ phone }, {
            $set: { name: customerName, email: customerEmail, idNumber },
            $setOnInsert: { phone }
        }, { new: true, upsert: true, runValidators: true });
        const nights = Math.ceil((end - start) / 86400000);
        const factor = Math.max(1, Number(seasonFactor || 1));
        const roomAmount = nights * Number(room.price) * factor;
        const bookingId = new mongoose.Types.ObjectId();
        const bookingCode = 'BK' + String(bookingId).slice(-6).toUpperCase();
        const b = await Booking.create({
            _id: bookingId, bookingCode, customerId: customer._id, customerName,
            customerPhone: phone, customerEmail, roomId, checkInDate: start, checkOutDate: end,
            seasonFactor: factor, roomAmount, totalAmount: roomAmount,
            deposit: Math.min(roomAmount, Math.max(0, Number(deposit || 0))), paidAmount: Math.min(roomAmount, Math.max(0, Number(deposit || 0))),
            paymentStatus: Number(deposit || 0) >= roomAmount ? 'paid' : Number(deposit || 0) > 0 ? 'pending' : 'unpaid',
            guests: Number(guests || 1), notes, status: 'confirmed'
        });
        r.status(201).json(await Booking.findById(b._id).populate('roomId').lean());
    } catch (e) {
        bad(r, e, e.status || 400);
    } finally {
        await releaseRoomLock(lockRoomId, lockToken).catch(() => {});
    }
});
app.post('/api/bookings/:id/checkin', async (q, r) => {
    try {
        let b = await Booking.findById(q.params.id);
        if (!b || b.status !== 'confirmed')
            return r.status(400).json({
                error: 'Booking không ở trạng thái có thể check-in'
            });
        const now = new Date();
        if (now < new Date(b.checkInDate))
            return r.status(400).json({ error: 'Chưa đến ngày nhận phòng theo đơn đặt.' });
        if (now >= new Date(b.checkOutDate))
            return r.status(400).json({ error: 'Ngày trả phòng của đơn đã qua. Hãy điều chỉnh booking trước khi check-in.' });
        const room = await Room.findById(b.roomId);
        if (!room || room.status === 'cleaning' || room.status === 'maintenance')
            return r.status(400).json({ error: 'Phòng chưa sẵn sàng để nhận khách.' });
        b.status = 'checked_in';
        b.actualCheckIn = now;
        await b.save();
        r.json(b);
    }
    catch (e) {
        bad(r, e);
    }
});
app.post('/api/bookings/:id/services', async (q, r) => {
    try {
        let b = await Booking.findById(q.params.id), s = await Service.findById(q.body.serviceId), qty = Math.max(1, Number(q.body.quantity || 1));
        if (!b || !s)
            return r.status(404).json({
                error: 'Không tìm thấy booking/dịch vụ'
            });
        b.serviceItems.push({
            serviceId: s._id, name: s.name, price: s.price, quantity: qty, amount: s.price * qty
        });
        b.serviceAmount = b.serviceItems.reduce((a, x) => a + (x.amount || 0), 0);
        b.totalAmount = Math.max(0, b.roomAmount + b.serviceAmount - b.discount);
        await b.save();
        r.json(b);
    }
    catch (e) {
        bad(r, e);
    }
});
app.post('/api/bookings/:id/payment', async (q, r) => {
    try {
        let b = await Booking.findById(q.params.id);
        if (!b)
            return r.status(404).json({
                error: 'Không tìm thấy booking'
            });
        const amount = Number(q.body.amount || 0);
        if (!Number.isFinite(amount) || amount < 0)
            return r.status(400).json({ error: 'Số tiền thanh toán không hợp lệ.' });
        if (amount <= 0)
            return r.status(400).json({ error: 'Số tiền ghi nhận phải lớn hơn 0.' });
        if (!['cash', 'transfer', 'card', 'other'].includes(q.body.method || b.paymentMethod))
            return r.status(400).json({ error: 'Phương thức thanh toán không hợp lệ.' });
        b.paidAmount = Math.min(b.totalAmount, Number(b.paidAmount || 0) + amount);
        if (q.body.method) b.paymentMethod = q.body.method;
        b.paymentStatus = b.paidAmount >= b.totalAmount ? 'paid' : 'pending';
        if (b.paymentStatus === 'paid' && b.paymentMethod === 'transfer') {
            b.notes = [b.notes, '[Khách sạn đã xác nhận nhận tiền QR ' + new Date().toISOString() + ']'].filter(Boolean).join('\n');
        }
        await b.save();
        r.json(b);
    }
    catch (e) {
        bad(r, e);
    }
});
app.post('/api/bookings/:id/checkout', async (q, r) => {
    try {
        let b = await Booking.findById(q.params.id);
        if (!b || b.status !== 'checked_in')
            return r.status(400).json({
                error: 'Booking chưa check-in'
            });
        b.status = 'checked_out';
        b.actualCheckOut = new Date();
        const balance = Math.max(0, Number(b.totalAmount || 0) - Number(b.paidAmount || 0));
        if (balance > 0)
            return r.status(400).json({ error: 'Booking còn nợ ' + balance + '₫. Hãy ghi nhận thanh toán thực tế trước khi check-out.' });
        b.paymentStatus = b.paidAmount >= b.totalAmount ? 'paid' : 'pending';
        await b.save();
        await Room.findByIdAndUpdate(b.roomId, {
            status: 'cleaning'
        });
        r.json(b);
    }
    catch (e) {
        bad(r, e);
    }
});
app.post('/api/bookings/:id/cancel', async (q, r) => {
    try {
        let b = await Booking.findById(q.params.id);
        if (!b)
            return r.status(404).json({
                error: 'Không tìm thấy đơn'
            });
        if (['checked_in', 'checked_out'].includes(b.status))
            return r.status(400).json({
                error: 'Không thể hủy booking đã nhận/trả phòng'
            });
        let days = (new Date(b.checkInDate) - new Date()) / 86400000, rate = days >= 3 ? 1 : days >= 1 ? .5 : 0, refund = Math.round(b.paidAmount * rate);
        b.status = 'cancelled';
        await b.save();
        r.json({
            message: 'Đã hủy', cancellation_detail: {
                refund_amount: refund
            }
        });
    }
    catch (e) {
        bad(r, e);
    }
});
app.get('/api/stats', async (q, r) => {
    let rooms = await Room.find().lean(), bookings = await Booking.find().lean(), now = new Date(), start = new Date();
    start.setHours(0, 0, 0, 0);
    let end = new Date(start.getTime() + 86400000), occupied = bookings.filter(x => x.status === 'checked_in').length, revenue = bookings.reduce((a, x) => a + (x.paidAmount || 0), 0), expected = bookings.filter(x => !['cancelled'].includes(x.status)).reduce((a, x) => a + (x.totalAmount || 0), 0), arrivals = bookings.filter(x => x.status === 'confirmed' && new Date(x.checkInDate) >= start && new Date(x.checkInDate) < end).length, departures = bookings.filter(x => x.status === 'checked_in' && new Date(x.checkOutDate) >= start && new Date(x.checkOutDate) < end).length, cleaning = rooms.filter(x => x.status === 'cleaning').length, maintenance = rooms.filter(x => x.status === 'maintenance').length;
    let monthly = [];
    for (let i = 5; i >= 0; i--) {
        let d = new Date(now.getFullYear(), now.getMonth() - i, 1), k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthly.push({
            month: k, total: 0
        });
    }
    for (let b of bookings) {
        let d = new Date(b.updatedAt || b.createdAt), k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, m = monthly.find(x => x.month === k);
        if (m)
            m.total += (b.paidAmount || 0);
    }
    r.json({
        rooms: rooms.length, bookings: bookings.length, occupied, occupancyRate: rooms.length ? Math.round(occupied / rooms.length * 100) : 0, revenue, expected, todayArrivals: arrivals, todayDepartures: departures, cleaning, maintenance, available: Math.max(0, rooms.length - occupied - cleaning - maintenance), monthly
    });
});
app.get('/{*splat}', (q, r) => r.sendFile(path.join(__dirname, 'public', 'index.html')));
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
