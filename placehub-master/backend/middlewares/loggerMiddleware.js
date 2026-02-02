import Log from '../models/Log.js'

export const requestLogger = async (req, res, next) => {
    const start = Date.now()

    // Finish listener to log the response
    res.on('finish', async () => {
        try {
            // Don't log regular logs fetching or health checks to avoid noise
            if (req.path.includes('/api/admin/logs') || req.path.includes('/api/health')) {
                return
            }

            const duration = Date.now() - start

            await Log.create({
                level: res.statusCode >= 400 ? (res.statusCode >= 500 ? 'error' : 'warn') : 'info',
                message: `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
                userId: req.user?.userId || req.user?.id,
                method: req.method,
                path: req.path,
                status: res.statusCode,
                ip: req.ip || req.headers['x-forwarded-for'],
                details: {
                    userAgent: req.headers['user-agent'],
                    duration
                }
            })
        } catch (err) {
            console.error('Logging Error:', err)
        }
    })

    next()
}

export const logEvent = async ({ level = 'info', message, userId, details }) => {
    try {
        await Log.create({ level, message, userId, details })
    } catch (err) {
        console.error('Manual Logging Error:', err)
    }
}
