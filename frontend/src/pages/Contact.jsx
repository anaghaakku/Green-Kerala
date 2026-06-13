import { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState('');

    const EMAILJS_SERVICE_ID = 'service_cwwm10q';
    const EMAILJS_TEMPLATE_ID = 'template_bl7gsgd';
    const EMAILJS_PUBLIC_KEY = 'lDpMqjfm5yb5QYi9M';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        // Validation
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            setLoading(false);
            alert('Please fill all required fields');
            return;
        }

        try {
            // Step 1: Save to Django Backend (for admin panel)
            console.log('Saving to backend...');
            console.log('Data being sent:', {
                name: formData.name,
                email: formData.email,
                subject: formData.subject || 'No Subject',
                message: formData.message
            });

            const backendResponse = await axios.post(
                'https://green-kerala-api.onrender.com/api/contact/',
                {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject || 'No Subject',
                    message: formData.message
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('Backend response:', backendResponse.data);

            if (backendResponse.status === 200 || backendResponse.status === 201) {
                console.log('✅ Message saved to database!');
                
                // Step 2: Send email via EmailJS
                try {
                    const templateParams = {
                        to_email: 'anaghaakku834@gmail.com',
                        from_name: formData.name,
                        from_email: formData.email,
                        subject: formData.subject || 'New Contact Message',
                        message: formData.message,
                        reply_to: formData.email
                    };
                    
                    await emailjs.send(
                        EMAILJS_SERVICE_ID, 
                        EMAILJS_TEMPLATE_ID, 
                        templateParams, 
                        EMAILJS_PUBLIC_KEY
                    );
                    console.log('✅ Email sent successfully!');
                } catch (emailError) {
                    console.error('Email error:', emailError);
                    // Don't fail the whole process if email fails
                }
                
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus(''), 5000);
            } else {
                throw new Error('Backend save failed');
            }
            
        } catch (error) {
            console.error('Error details:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status === 400) {
                setStatus('error');
                alert('Validation error: ' + JSON.stringify(error.response.data));
            } else if (error.response?.status === 403) {
                setStatus('error');
                alert('Permission denied');
            } else if (error.response?.status === 500) {
                setStatus('error');
                alert('Server error. Please try again later.');
            } else {
                setStatus('error');
                alert('Network error. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!subscribeEmail) {
            setSubscribeStatus('error');
            setTimeout(() => setSubscribeStatus(''), 3000);
            return;
        }

        setSubscribeStatus('loading');

        try {
            const templateParams = {
                to_email: subscribeEmail,
                from_name: 'HarithaMission',
                from_email: 'noreply@harithamission.org',
                subject: 'Welcome to HarithaMission Newsletter! 🌿',
                message: `Thank you for subscribing to HarithaMission newsletter! 🌿\n\nYou will receive updates about:\n• Eco-missions\n• Waste pickups\n• New rewards\n• Volunteer opportunities\n\nStay tuned for exciting updates!\n\n- HarithaMission Team`,
                reply_to: 'hello@harithamission.org'
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID, 
                EMAILJS_TEMPLATE_ID, 
                templateParams, 
                EMAILJS_PUBLIC_KEY
            );
            
            setSubscribeStatus('success');
            setSubscribeEmail('');
            setTimeout(() => setSubscribeStatus(''), 5000);
        } catch (error) {
            console.error('Subscription error:', error);
            setSubscribeStatus('error');
            setTimeout(() => setSubscribeStatus(''), 3000);
        }
    };

    const contactInfo = [
        { icon: '📍', title: 'Head Office', detail: 'Green Valley, Kochi, Kerala - 682001', color: '#4CAF50' },
        { icon: '📞', title: 'Phone', detail: '+91 98765 43210', color: '#2196F3', sub: 'Mon-Fri, 9AM - 6PM' },
        { icon: '✉️', title: 'Email', detail: 'hello@harithamission.org', color: '#FF9800', sub: 'We reply within 24 hours' },
        { icon: '⏰', title: 'Working Hours', detail: 'Monday - Friday', color: '#9C27B0', sub: '9:00 AM - 6:00 PM' }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: '📘', url: 'https://facebook.com', color: '#1877F2' },
        { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', color: '#1DA1F2' },
        { name: 'Instagram', icon: '📸', url: 'https://instagram.com', color: '#E4405F' },
        { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', color: '#0077B5' },
        { name: 'YouTube', icon: '📺', url: 'https://youtube.com', color: '#FF0000' },
        { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/919876543210', color: '#25D366' }
    ];

    const faqItems = [
        { q: "How do I earn points?", a: "You earn points by scheduling waste pickups, joining missions, and referring friends." },
        { q: "How can I redeem rewards?", a: "Once you have enough points, go to the Rewards Store and click 'Redeem Now'." },
        { q: "Is waste pickup free?", a: "Yes! Waste pickup service is completely free." },
        { q: "How do I become a volunteer?", a: "Simply register an account on our website." },
        { q: "What areas do you serve?", a: "We serve all major cities in Kerala." }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="container-fluid px-0">
            <div className="text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="container">
                    <div className="display-1 mb-3">📧</div>
                    <h1 className="display-3 fw-bold">Get in Touch</h1>
                    <p className="lead fs-4 mt-3">We'd love to hear from you!</p>
                    <p className="mt-3">Have questions? Want to volunteer? Need support? Reach out to us.</p>
                </div>
            </div>

            <div className="container my-5">
                <div className="row g-4 mb-5">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="col-md-3 col-6">
                            <div className="card text-center h-100 border-0 shadow-sm rounded-4">
                                <div className="card-body">
                                    <div className="display-1 mb-3">{info.icon}</div>
                                    <h5 className="fw-bold" style={{ color: info.color }}>{info.title}</h5>
                                    <p className="mb-0 fw-semibold">{info.detail}</p>
                                    {info.sub && <small className="text-muted">{info.sub}</small>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-5">
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-lg rounded-4">
                            <div className="card-header bg-white border-0 pt-4">
                                <h2 className="fw-bold text-center">📝 Send a Message</h2>
                                <p className="text-center text-muted">We'll get back to you within 24 hours</p>
                            </div>
                            <div className="card-body p-4">
                                {status === 'success' && (
                                    <div className="alert alert-success">
                                        <strong>✅ Message sent successfully!</strong> We've received your message and will contact you soon.
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="alert alert-danger">
                                        <strong>❌ Failed to send message.</strong> Please try again or call us directly.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Your Name *</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-success text-white">👤</span>
                                            <input type="text" name="name" className="form-control" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Email Address *</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-success text-white">✉️</span>
                                            <input type="email" name="email" className="form-control" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Subject</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-success text-white">📌</span>
                                            <input type="text" name="subject" className="form-control" placeholder="What is this regarding?" value={formData.subject} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Message *</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-success text-white" style={{ alignItems: 'flex-start' }}>💬</span>
                                            <textarea name="message" className="form-control" rows="5" placeholder="Write your message here..." value={formData.message} onChange={handleChange} required></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5 rounded-pill" disabled={loading}>
                                        {loading ? (
                                            <span><span className="spinner-border spinner-border-sm me-2"></span>Sending...</span>
                                        ) : (
                                            <span>📤 Send Message</span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card border-0 shadow-lg rounded-4 mb-4">
                            <div className="card-body p-0">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125734.7898565833!2d76.2178949!3d9.9312329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514aecdfe3%3A0x4bd7a75faafd4da0!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                    width="100%" 
                                    height="250" 
                                    style={{ border: 0, borderRadius: '16px 16px 0 0' }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    title="HarithaMission Location"
                                ></iframe>
                                <div className="p-4">
                                    <h5 className="fw-bold">📍 Visit Our Office</h5>
                                    <p className="text-muted">Green Valley, Kochi, Kerala - 682001</p>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-lg rounded-4 mb-4">
                            <div className="card-body p-4 text-center">
                                <h4 className="fw-bold mb-3">📱 Connect With Us</h4>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    {socialLinks.map((social, index) => (
                                        <a key={index} href={social.url} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 55, height: 55, backgroundColor: social.color }}>
                                                <span className="fs-2 text-white">{social.icon}</span>
                                            </div>
                                            <small className="text-muted mt-1 d-block">{social.name}</small>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)' }}>
                            <div className="card-body p-4 text-center text-white">
                                <div className="display-2 mb-3">💚</div>
                                <h4 className="fw-bold">24/7 Support</h4>
                                <p>Emergency support for urgent waste collection needs</p>
                                <div className="mt-3">
                                    <span className="display-6 fw-bold">+91 98765 43210</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card border-0 shadow-lg rounded-4">
                            <div className="card-header bg-white border-0 pt-4">
                                <h2 className="fw-bold text-center">❓ Frequently Asked Questions</h2>
                            </div>
                            <div className="card-body p-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="mb-3 border rounded-3">
                                        <button 
                                            className="btn w-100 text-start fw-semibold p-3"
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            style={{ backgroundColor: '#f8f9fa' }}
                                        >
                                            <span className="me-2 text-success">❓</span> {item.q}
                                        </button>
                                        {openFaq === index && (
                                            <div className="p-3 text-muted border-top">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card border-0 bg-light rounded-4">
                            <div className="card-body p-5 text-center">
                                <div className="display-2 mb-3">📧</div>
                                <h3 className="fw-bold">Subscribe to Our Newsletter</h3>
                                <p>Get latest updates, eco-tips, and mission announcements directly in your inbox.</p>
                                <div className="row justify-content-center">
                                    <div className="col-md-6">
                                        <form onSubmit={handleSubscribe}>
                                            <div className="input-group">
                                                <input 
                                                    type="email" 
                                                    className="form-control form-control-lg" 
                                                    placeholder="Your email address" 
                                                    value={subscribeEmail}
                                                    onChange={(e) => setSubscribeEmail(e.target.value)}
                                                    required 
                                                />
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-success btn-lg px-4"
                                                    disabled={subscribeStatus === 'loading'}
                                                >
                                                    {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                                </button>
                                            </div>
                                            {subscribeStatus === 'success' && (
                                                <div className="alert alert-success mt-2">✅ Subscribed successfully!</div>
                                            )}
                                            {subscribeStatus === 'error' && (
                                                <div className="alert alert-danger mt-2">❌ Please enter a valid email.</div>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;