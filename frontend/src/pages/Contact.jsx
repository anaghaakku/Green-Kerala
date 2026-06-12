// import { useState } from 'react';
// import axios from 'axios';

// const Contact = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         subject: '',
//         message: ''
//     });
//     const [status, setStatus] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setStatus('');

//         try {
//             await axios.post('https://green-kerala-api.onrender.com/api/contact/', formData);
//             setStatus('success');
//             setFormData({ name: '', email: '', subject: '', message: '' });
//             setTimeout(() => setStatus(''), 5000);
//         } catch (error) {
//             setStatus('error');
//             setTimeout(() => setStatus(''), 5000);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const contactInfo = [
//         { icon: '📍', title: 'Head Office', detail: 'Green Valley, Kochi, Kerala - 682001', color: '#4CAF50' },
//         { icon: '📞', title: 'Phone', detail: '+91 98765 43210', color: '#2196F3', sub: 'Mon-Fri, 9AM - 6PM' },
//         { icon: '✉️', title: 'Email', detail: 'hello@harithamission.org', color: '#FF9800', sub: 'We reply within 24 hours' },
//         { icon: '⏰', title: 'Working Hours', detail: 'Monday - Friday', color: '#9C27B0', sub: '9:00 AM - 6:00 PM' }
//     ];

//     const socialLinks = [
//         { name: 'Facebook', icon: '📘', url: '#', color: '#1877F2' },
//         { name: 'Twitter', icon: '🐦', url: '#', color: '#1DA1F2' },
//         { name: 'Instagram', icon: '📸', url: '#', color: '#E4405F' },
//         { name: 'LinkedIn', icon: '💼', url: '#', color: '#0077B5' },
//         { name: 'YouTube', icon: '📺', url: '#', color: '#FF0000' },
//         { name: 'WhatsApp', icon: '💬', url: '#', color: '#25D366' }
//     ];

//     const faqItems = [
//         { q: "How do I earn points?", a: "You earn points by scheduling waste pickups, joining missions, and referring friends. Each activity gives you different points based on the waste type and weight." },
//         { q: "How can I redeem rewards?", a: "Once you have enough points, go to the Rewards Store, choose your reward, and click 'Redeem Now'. Our team will contact you for delivery." },
//         { q: "Is waste pickup free?", a: "Yes! Waste pickup service is completely free. You only pay if you opt for premium express pickup service." },
//         { q: "How do I become a volunteer?", a: "Simply register an account on our website. You can then start scheduling pickups and joining missions immediately." },
//         { q: "What areas do you serve?", a: "We currently serve all major cities in Kerala including Kochi, Thiruvananthapuram, Kozhikode, and surrounding areas." }
//     ];

//     const [openFaq, setOpenFaq] = useState(null);

//     return (
//         <div className="container-fluid px-0">
//             {/* Hero Section */}
//             <div className="text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
//                 <div className="container">
//                     <div className="display-1 mb-3">📧</div>
//                     <h1 className="display-3 fw-bold">Get in Touch</h1>
//                     <p className="lead fs-4 mt-3">We'd love to hear from you!</p>
//                     <p className="mt-3">Have questions? Want to volunteer? Need support? Reach out to us.</p>
//                 </div>
//             </div>

//             <div className="container my-5">
//                 {/* Contact Info Cards */}
//                 <div className="row g-4 mb-5">
//                     {contactInfo.map((info, index) => (
//                         <div key={index} className="col-md-3 col-6">
//                             <div className="card text-center h-100 border-0 shadow-sm rounded-4" style={{ transition: 'transform 0.3s' }}>
//                                 <div className="card-body">
//                                     <div className="display-1 mb-3">{info.icon}</div>
//                                     <h5 className="fw-bold" style={{ color: info.color }}>{info.title}</h5>
//                                     <p className="mb-0 fw-semibold">{info.detail}</p>
//                                     {info.sub && <small className="text-muted">{info.sub}</small>}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="row g-5">
//                     {/* Contact Form */}
//                     <div className="col-lg-6">
//                         <div className="card border-0 shadow-lg rounded-4">
//                             <div className="card-header bg-white border-0 pt-4">
//                                 <h2 className="fw-bold text-center">📝 Send a Message</h2>
//                                 <p className="text-center text-muted">We'll get back to you within 24 hours</p>
//                             </div>
//                             <div className="card-body p-4">
//                                 {status === 'success' && (
//                                     <div className="alert alert-success alert-dismissible fade show" role="alert">
//                                         <strong>✅ Message sent successfully!</strong> Thank you for reaching out. We'll contact you soon.
//                                         <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setStatus('')}></button>
//                                     </div>
//                                 )}
//                                 {status === 'error' && (
//                                     <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                                         <strong>❌ Failed to send message.</strong> Please try again or contact us directly via phone.
//                                         <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setStatus('')}></button>
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleSubmit}>
//                                     <div className="mb-3">
//                                         <label className="form-label fw-bold">Your Name *</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text bg-success text-white">👤</span>
//                                             <input type="text" name="name" className="form-control" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
//                                         </div>
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label fw-bold">Email Address *</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text bg-success text-white">✉️</span>
//                                             <input type="email" name="email" className="form-control" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
//                                         </div>
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label fw-bold">Subject *</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text bg-success text-white">📌</span>
//                                             <input type="text" name="subject" className="form-control" placeholder="What is this regarding?" value={formData.subject} onChange={handleChange} required />
//                                         </div>
//                                     </div>
//                                     <div className="mb-3">
//                                         <label className="form-label fw-bold">Message *</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text bg-success text-white" style={{ alignItems: 'flex-start' }}>💬</span>
//                                             <textarea name="message" className="form-control" rows="5" placeholder="Write your message here..." value={formData.message} onChange={handleChange} required></textarea>
//                                         </div>
//                                     </div>
//                                     <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5" disabled={loading}>
//                                         {loading ? (
//                                             <span><span className="spinner-border spinner-border-sm me-2"></span>Sending...</span>
//                                         ) : (
//                                             <span>📤 Send Message</span>
//                                         )}
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Side - Map & Social */}
//                     <div className="col-lg-6">
//                         {/* Map Card */}
//                         <div className="card border-0 shadow-lg rounded-4 mb-4">
//                             <div className="card-body p-0">
//                                 <iframe 
//                                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125734.7898565833!2d76.2178949!3d9.9312329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514aecdfe3%3A0x4bd7a75faafd4da0!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
//                                     width="100%" 
//                                     height="250" 
//                                     style={{ border: 0, borderRadius: '16px 16px 0 0' }} 
//                                     allowFullScreen="" 
//                                     loading="lazy" 
//                                     referrerPolicy="no-referrer-when-downgrade"
//                                     title="HarithaMission Location"
//                                 ></iframe>
//                                 <div className="p-4">
//                                     <h5 className="fw-bold">📍 Visit Our Office</h5>
//                                     <p className="text-muted">Green Valley, Kochi, Kerala - 682001</p>
//                                     <button className="btn btn-outline-success btn-sm">Get Directions →</button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Social Media Card */}
//                         <div className="card border-0 shadow-lg rounded-4 mb-4">
//                             <div className="card-body p-4 text-center">
//                                 <h4 className="fw-bold mb-3">📱 Connect With Us</h4>
//                                 <p className="text-muted">Follow us on social media for updates and eco-tips</p>
//                                 <div className="d-flex flex-wrap justify-content-center gap-3">
//                                     {socialLinks.map((social, index) => (
//                                         <a key={index} href={social.url} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
//                                             <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 55, height: 55, backgroundColor: social.color, transition: 'transform 0.3s' }}>
//                                                 <span className="fs-2 text-white">{social.icon}</span>
//                                             </div>
//                                             <small className="text-muted mt-1 d-block">{social.name}</small>
//                                         </a>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Support Card */}
//                         <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)' }}>
//                             <div className="card-body p-4 text-center text-white">
//                                 <div className="display-2 mb-3">💚</div>
//                                 <h4 className="fw-bold">24/7 Support</h4>
//                                 <p>Emergency support for urgent waste collection needs</p>
//                                 <div className="mt-3">
//                                     <span className="display-6 fw-bold">+91 98765 43210</span>
//                                     <p className="mt-2 mb-0"><small>Available 24/7 for emergencies</small></p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* FAQ Section */}
//                 <div className="row mt-5">
//                     <div className="col-12">
//                         <div className="card border-0 shadow-lg rounded-4">
//                             <div className="card-header bg-white border-0 pt-4">
//                                 <h2 className="fw-bold text-center">❓ Frequently Asked Questions</h2>
//                                 <p className="text-center text-muted">Find quick answers to common questions</p>
//                             </div>
//                             <div className="card-body p-4">
//                                 <div className="accordion" id="faqAccordion">
//                                     {faqItems.map((item, index) => (
//                                         <div key={index} className="accordion-item mb-3 border rounded-3">
//                                             <h2 className="accordion-header">
//                                                 <button 
//                                                     className={`accordion-button ${openFaq === index ? '' : 'collapsed'} fw-semibold`} 
//                                                     type="button" 
//                                                     onClick={() => setOpenFaq(openFaq === index ? null : index)}
//                                                     style={{ backgroundColor: '#f8f9fa' }}
//                                                 >
//                                                     <span className="me-2 text-success">❓</span> {item.q}
//                                                 </button>
//                                             </h2>
//                                             <div className={`accordion-collapse collapse ${openFaq === index ? 'show' : ''}`}>
//                                                 <div className="accordion-body text-muted">
//                                                     {item.a}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Newsletter Section */}
//                 <div className="row mt-5">
//                     <div className="col-12">
//                         <div className="card border-0 bg-light rounded-4">
//                             <div className="card-body p-5 text-center">
//                                 <div className="display-2 mb-3">📧</div>
//                                 <h3 className="fw-bold">Subscribe to Our Newsletter</h3>
//                                 <p>Get latest updates, eco-tips, and mission announcements directly in your inbox.</p>
//                                 <div className="row justify-content-center">
//                                     <div className="col-md-6">
//                                         <div className="input-group">
//                                             <input type="email" className="form-control form-control-lg" placeholder="Your email address" />
//                                             <button className="btn btn-success btn-lg px-4">Subscribe</button>
//                                         </div>
//                                         <small className="text-muted mt-2 d-block">No spam, unsubscribe anytime.</small>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Contact;


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

    // EmailJS Configuration - Your Credentials
    const EMAILJS_SERVICE_ID = 'service_cwwm10q';
    const EMAILJS_TEMPLATE_ID = 'template_bl7gsg';
    const EMAILJS_PUBLIC_KEY = 'lDpMqjfm5yb5QYi9M';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            await axios.post('https://green-kerala-api.onrender.com/api/contact/', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    // Subscribe to newsletter using EmailJS
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
                message: 'Thank you for subscribing to our newsletter! You will receive updates about eco-missions, waste pickups, and rewards.',
                reply_to: subscribeEmail,
                user_email: subscribeEmail,
                subject: 'Welcome to HarithaMission Newsletter!'
            };

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
            setSubscribeStatus('success');
            setSubscribeEmail('');
            setTimeout(() => setSubscribeStatus(''), 5000);
        } catch (error) {
            console.error('EmailJS error:', error);
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
        { q: "How do I earn points?", a: "You earn points by scheduling waste pickups, joining missions, and referring friends. Each activity gives you different points based on the waste type and weight." },
        { q: "How can I redeem rewards?", a: "Once you have enough points, go to the Rewards Store, choose your reward, and click 'Redeem Now'. Our team will contact you for delivery." },
        { q: "Is waste pickup free?", a: "Yes! Waste pickup service is completely free. You only pay if you opt for premium express pickup service." },
        { q: "How do I become a volunteer?", a: "Simply register an account on our website. You can then start scheduling pickups and joining missions immediately." },
        { q: "What areas do you serve?", a: "We currently serve all major cities in Kerala including Kochi, Thiruvananthapuram, Kozhikode, and surrounding areas." }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="container-fluid px-0">
            {/* Hero Section */}
            <div className="text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="container">
                    <div className="display-1 mb-3">📧</div>
                    <h1 className="display-3 fw-bold">Get in Touch</h1>
                    <p className="lead fs-4 mt-3">We'd love to hear from you!</p>
                    <p className="mt-3">Have questions? Want to volunteer? Need support? Reach out to us.</p>
                </div>
            </div>

            <div className="container my-5">
                {/* Contact Info Cards */}
                <div className="row g-4 mb-5">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="col-md-3 col-6">
                            <div className="card text-center h-100 border-0 shadow-sm rounded-4" style={{ transition: 'transform 0.3s' }}>
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
                    {/* Contact Form */}
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-lg rounded-4">
                            <div className="card-header bg-white border-0 pt-4">
                                <h2 className="fw-bold text-center">📝 Send a Message</h2>
                                <p className="text-center text-muted">We'll get back to you within 24 hours</p>
                            </div>
                            <div className="card-body p-4">
                                {status === 'success' && (
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        <strong>✅ Message sent successfully!</strong> Thank you for reaching out. We'll contact you soon.
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setStatus('')}></button>
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>❌ Failed to send message.</strong> Please try again or contact us directly via phone.
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setStatus('')}></button>
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
                                        <label className="form-label fw-bold">Subject *</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-success text-white">📌</span>
                                            <input type="text" name="subject" className="form-control" placeholder="What is this regarding?" value={formData.subject} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Message *</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-success text-white" style={{ alignItems: 'flex-start' }}>💬</span>
                                            <textarea name="message" className="form-control" rows="5" placeholder="Write your message here..." value={formData.message} onChange={handleChange} required></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5" disabled={loading}>
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

                    {/* Right Side - Map & Social */}
                    <div className="col-lg-6">
                        {/* Map Card */}
                        <div className="card border-0 shadow-lg rounded-4 mb-4">
                            <div className="card-body p-0">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125734.7898565833!2d76.2178949!3d9.9312329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514aecdfe3%3A0x4bd7a75faafd4da0!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                    width="100%" 
                                    height="250" 
                                    style={{ border: 0, borderRadius: '16px 16px 0 0' }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="HarithaMission Location"
                                ></iframe>
                                <div className="p-4">
                                    <h5 className="fw-bold">📍 Visit Our Office</h5>
                                    <p className="text-muted">Green Valley, Kochi, Kerala - 682001</p>
                                    <button className="btn btn-outline-success btn-sm">Get Directions →</button>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Card */}
                        <div className="card border-0 shadow-lg rounded-4 mb-4">
                            <div className="card-body p-4 text-center">
                                <h4 className="fw-bold mb-3">📱 Connect With Us</h4>
                                <p className="text-muted">Follow us on social media for updates and eco-tips</p>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    {socialLinks.map((social, index) => (
                                        <a key={index} href={social.url} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 55, height: 55, backgroundColor: social.color, transition: 'transform 0.3s' }}>
                                                <span className="fs-2 text-white">{social.icon}</span>
                                            </div>
                                            <small className="text-muted mt-1 d-block">{social.name}</small>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)' }}>
                            <div className="card-body p-4 text-center text-white">
                                <div className="display-2 mb-3">💚</div>
                                <h4 className="fw-bold">24/7 Support</h4>
                                <p>Emergency support for urgent waste collection needs</p>
                                <div className="mt-3">
                                    <span className="display-6 fw-bold">+91 98765 43210</span>
                                    <p className="mt-2 mb-0"><small>Available 24/7 for emergencies</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card border-0 shadow-lg rounded-4">
                            <div className="card-header bg-white border-0 pt-4">
                                <h2 className="fw-bold text-center">❓ Frequently Asked Questions</h2>
                                <p className="text-center text-muted">Find quick answers to common questions</p>
                            </div>
                            <div className="card-body p-4">
                                <div className="accordion" id="faqAccordion">
                                    {faqItems.map((item, index) => (
                                        <div key={index} className="accordion-item mb-3 border rounded-3">
                                            <h2 className="accordion-header">
                                                <button 
                                                    className={`accordion-button ${openFaq === index ? '' : 'collapsed'} fw-semibold`} 
                                                    type="button" 
                                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                                    style={{ backgroundColor: '#f8f9fa' }}
                                                >
                                                    <span className="me-2 text-success">❓</span> {item.q}
                                                </button>
                                            </h2>
                                            <div className={`accordion-collapse collapse ${openFaq === index ? 'show' : ''}`}>
                                                <div className="accordion-body text-muted">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card border-0 bg-light rounded-4">
                            <div className="card-body p-5 text-center">
                                <div className="display-2 mb-3">📧</div>
                                <h3 className="fw-bold">Subscribe to Our Newsletter</h3>
                                <p>Get latest updates, eco-tips, and mission announcements directly in your inbox.</p>
                                <div className="row justify-content-center">
                                    <div className="col-md-6">
                                        <form onSubmit={handleSubscribe} className="d-flex flex-column gap-2">
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
                                                <div className="alert alert-success py-2 mt-2">✅ Subscribed successfully! Check your email.</div>
                                            )}
                                            {subscribeStatus === 'error' && (
                                                <div className="alert alert-danger py-2 mt-2">❌ Please enter a valid email address.</div>
                                            )}
                                            <small className="text-muted">No spam, unsubscribe anytime.</small>
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
