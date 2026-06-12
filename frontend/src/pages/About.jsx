import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const [activeSection, setActiveSection] = useState('mission');
    const navigate = useNavigate();

    const stats = [
        { number: "1,250+", label: "Active Volunteers", icon: "👥", color: "#4CAF50" },
        { number: "85+", label: "Missions Completed", icon: "🎯", color: "#2196F3" },
        { number: "5,000+", label: "Trees Planted", icon: "🌳", color: "#8BC34A" },
        { number: "12+", label: "Partner NGOs", icon: "🤝", color: "#FF9800" },
        { number: "10,000+", label: "KG Waste Collected", icon: "♻️", color: "#9C27B0" },
        { number: "2,500+", label: "Happy Volunteers", icon: "😊", color: "#E91E63" }
    ];

    const teamMembers = [
        { name: "Anjali Nair", role: "Founder & Director", icon: "👩‍🌾", bio: "Environmental scientist with 10+ years of experience", color: "#4CAF50" },
        { name: "Rajesh Menon", role: "Program Coordinator", icon: "👨‍💼", bio: "Expert in waste management and recycling", color: "#2196F3" },
        { name: "Meera Krishnan", role: "Field Operations", icon: "👩‍🔬", bio: "Passionate about community-driven change", color: "#FF9800" },
        { name: "Arjun Dev", role: "Volunteer Manager", icon: "👨‍🏫", bio: "Building strong volunteer communities", color: "#9C27B0" }
    ];

    const achievements = [
        { year: "2024", title: "Launched HarithaMission", description: "Started with 50 volunteers in Kochi", icon: "🚀" },
        { year: "2025", title: "100+ Missions", description: "Completed over 100 successful missions", icon: "🏆" },
        { year: "2026", title: "Green Kerala Initiative", description: "Partnered with 12 NGOs across Kerala", icon: "🌿" }
    ];

    const testimonials = [
        { name: "Amal Joseph", role: "Volunteer", text: "HarithaMission changed my perspective on waste management. I've earned 500+ points and redeemed great rewards!", rating: 5, icon: "⭐" },
        { name: "Priya Suresh", role: "Regular Volunteer", text: "The composting guide is amazing! I started composting at home and now my garden is thriving.", rating: 5, icon: "⭐" },
        { name: "Rahul Nair", role: "Student Volunteer", text: "Best platform to contribute to the environment. The points system keeps me motivated!", rating: 5, icon: "⭐" }
    ];

    // Button handlers
    const handleBecomeVolunteer = () => {
        navigate('/register');
    };

    const handleWriteTestimonial = () => {
        navigate('/contact');
    };

    return (
        <div className="container-fluid px-0">
            {/* Hero Section */}
            <div className="text-white text-center py-5" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)' }}>
                <div className="container">
                    <div className="display-1 mb-3">🌿</div>
                    <h1 className="display-3 fw-bold">About HarithaMission</h1>
                    <p className="lead fs-3 mt-3">Together for a Greener Kerala</p>
                    <div className="mt-4">
                        <span className="badge bg-light text-success fs-6 p-3 me-2">🌍 Eco-Friendly</span>
                        <span className="badge bg-light text-success fs-6 p-3 me-2">♻️ Zero Waste</span>
                        <span className="badge bg-light text-success fs-6 p-3">🤝 Community Driven</span>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container py-5">
                <div className="row g-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-md-4 col-lg-2 col-6">
                            <div className="card text-center h-100 border-0 shadow-sm" style={{ transition: 'transform 0.3s' }}>
                                <div className="card-body">
                                    <div className="display-1 mb-2">{stat.icon}</div>
                                    <h2 className="fw-bold" style={{ color: stat.color }}>{stat.number}</h2>
                                    <p className="text-muted mb-0">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="container">
                <ul className="nav nav-tabs justify-content-center border-0 mb-5">
                    <li className="nav-item">
                        <button className={`btn btn-lg me-3 px-4 py-2 rounded-pill fw-bold ${activeSection === 'mission' ? 'btn-success text-white shadow' : 'btn-outline-success'}`} onClick={() => setActiveSection('mission')}>
                            🎯 Our Mission
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn btn-lg me-3 px-4 py-2 rounded-pill fw-bold ${activeSection === 'team' ? 'btn-success text-white shadow' : 'btn-outline-success'}`} onClick={() => setActiveSection('team')}>
                            👥 Our Team
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn btn-lg me-3 px-4 py-2 rounded-pill fw-bold ${activeSection === 'achievements' ? 'btn-success text-white shadow' : 'btn-outline-success'}`} onClick={() => setActiveSection('achievements')}>
                            🏆 Achievements
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`btn btn-lg px-4 py-2 rounded-pill fw-bold ${activeSection === 'testimonials' ? 'btn-success text-white shadow' : 'btn-outline-success'}`} onClick={() => setActiveSection('testimonials')}>
                            💬 Testimonials
                        </button>
                    </li>
                </ul>
            </div>

            {/* Mission Section */}
            {activeSection === 'mission' && (
                <div className="container py-4">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="card border-0 bg-light p-4 rounded-4">
                                <div className="display-1 text-center mb-3">🌍</div>
                                <h2 className="text-center fw-bold text-success">Our Mission</h2>
                                <p className="lead text-center mt-3">To unite eco-conscious individuals and organizations to protect and restore our environment through collective action.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 bg-success bg-opacity-10 p-4 rounded-4">
                                <div className="display-1 text-center mb-3">👁️</div>
                                <h2 className="text-center fw-bold text-success">Our Vision</h2>
                                <p className="lead text-center mt-3">A sustainable, waste-free, and green Kerala for future generations.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-5">
                                    <h3 className="fw-bold text-center mb-5">What We Do</h3>
                                    <div className="row">
                                        <div className="col-md-4 text-center mb-4">
                                            <div className="display-2 mb-3">🌳</div>
                                            <h4>Tree Planting Campaigns</h4>
                                            <p className="text-muted">Organize large-scale tree planting events across Kerala</p>
                                        </div>
                                        <div className="col-md-4 text-center mb-4">
                                            <div className="display-2 mb-3">🏖️</div>
                                            <h4>Beach & City Cleanups</h4>
                                            <p className="text-muted">Regular cleanup drives to keep our cities and beaches clean</p>
                                        </div>
                                        <div className="col-md-4 text-center mb-4">
                                            <div className="display-2 mb-3">♻️</div>
                                            <h4>Waste Management</h4>
                                            <p className="text-muted">Door-to-door waste collection and recycling services</p>
                                        </div>
                                        <div className="col-md-4 text-center mb-4">
                                            <div className="display-2 mb-3">📚</div>
                                            <h4>Awareness Workshops</h4>
                                            <p className="text-muted">Educational programs on composting and sustainability</p>
                                        </div>
                                        <div className="col-md-4 text-center mb-4">
                                            <div className="display-2 mb-3">🚰</div>
                                            <h4>Water Body Restoration</h4>
                                            <p className="text-muted">Cleaning and restoring rivers, ponds, and lakes</p>
                                        </div>
                                        <div className="col-md-4 text-center mb-4">
                                            <div className="display-2 mb-3">🌾</div>
                                            <h4>Sustainable Farming</h4>
                                            <p className="text-muted">Promoting organic and sustainable farming practices</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
                <div className="container py-4">
                    <div className="row g-4">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="col-md-3 col-6">
                                <div className="card text-center h-100 border-0 shadow-sm rounded-4">
                                    <div className="card-body">
                                        <div className="display-1 mb-3">{member.icon}</div>
                                        <h4 className="fw-bold">{member.name}</h4>
                                        <p className="text-success fw-bold">{member.role}</p>
                                        <p className="text-muted small">{member.bio}</p>
                                        <div className="mt-3">
                                            <span className="badge bg-light text-success">🌿 Eco Warrior</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card bg-success text-white rounded-4">
                                <div className="card-body p-5 text-center">
                                    <div className="display-2 mb-3">🤝</div>
                                    <h3>Join Our Growing Family</h3>
                                    <p className="lead">We're always looking for passionate volunteers and team members!</p>
                                    <button 
                                        onClick={handleBecomeVolunteer}
                                        className="btn btn-light btn-lg text-success fw-bold px-4"
                                    >
                                        Become a Volunteer →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievements Section */}
            {activeSection === 'achievements' && (
                <div className="container py-4">
                    <div className="row g-4">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card text-center h-100 border-0 shadow-sm rounded-4">
                                    <div className="card-body">
                                        <div className="display-1 mb-3">{achievement.icon}</div>
                                        <span className="badge bg-success mb-3">{achievement.year}</span>
                                        <h4 className="fw-bold">{achievement.title}</h4>
                                        <p className="text-muted">{achievement.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card border-0 bg-light rounded-4">
                                <div className="card-body p-5 text-center">
                                    <div className="display-2 mb-3">🏅</div>
                                    <h3>Our Impact So Far</h3>
                                    <div className="row mt-4">
                                        <div className="col-md-3 col-6 mb-3">
                                            <h2 className="fw-bold text-success">1,250+</h2>
                                            <p>Active Volunteers</p>
                                        </div>
                                        <div className="col-md-3 col-6 mb-3">
                                            <h2 className="fw-bold text-success">85+</h2>
                                            <p>Missions</p>
                                        </div>
                                        <div className="col-md-3 col-6 mb-3">
                                            <h2 className="fw-bold text-success">5,000+</h2>
                                            <p>Trees Planted</p>
                                        </div>
                                        <div className="col-md-3 col-6 mb-3">
                                            <h2 className="fw-bold text-success">10,000+</h2>
                                            <p>KG Waste Collected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
                <div className="container py-4">
                    <div className="row g-4">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="display-4 me-3">{testimonial.icon}</div>
                                            <div>
                                                <h5 className="fw-bold mb-0">{testimonial.name}</h5>
                                                <small className="text-success">{testimonial.role}</small>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <span key={i} className="text-warning fs-5">★</span>
                                            ))}
                                        </div>
                                        <p className="text-muted">"{testimonial.text}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-5">
                        <div className="col-12 text-center">
                            <div className="card bg-success text-white rounded-4">
                                <div className="card-body p-5">
                                    <div className="display-2 mb-3">📝</div>
                                    <h3>Share Your Story</h3>
                                    <p>Have a great experience with HarithaMission? We'd love to hear from you!</p>
                                    <button 
                                        onClick={handleWriteTestimonial}
                                        className="btn btn-light btn-lg text-success fw-bold px-4"
                                    >
                                        Write a Testimonial
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About;