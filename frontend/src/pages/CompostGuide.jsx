import { useState } from 'react';

const CompostGuide = () => {
    const [activeTab, setActiveTab] = useState('steps');

    const steps = [
        { step: 1, title: 'Choose a Bin', description: 'Select a compost bin or make your own using a container with holes for air circulation.', icon: '🗑️' },
        { step: 2, title: 'Add Browns (Carbon)', description: 'Dry leaves, cardboard, paper, sawdust, wood chips - these provide energy for microbes.', icon: '🍂' },
        { step: 3, title: 'Add Greens (Nitrogen)', description: 'Food scraps, grass clippings, coffee grounds, vegetable peels - these provide protein.', icon: '🥬' },
        { step: 4, title: 'Add Water', description: 'Keep the pile moist like a wrung-out sponge - not too wet, not too dry.', icon: '💧' },
        { step: 5, title: 'Turn the Pile', description: 'Mix every 1-2 weeks to add oxygen and speed up decomposition.', icon: '🔄' },
        { step: 6, title: 'Harvest Compost', description: 'Ready in 2-6 months when it looks dark, crumbly, and smells like earth.', icon: '🌱' },
    ];

    const greenMaterials = ['Fruit and vegetable scraps', 'Grass clippings', 'Coffee grounds', 'Tea bags', 'Fresh leaves', 'Plant trimmings', 'Eggshells', 'Flowers'];
    const brownMaterials = ['Dry leaves', 'Cardboard (shredded)', 'Newspaper', 'Straw and hay', 'Sawdust', 'Wood chips', 'Paper towels', 'Corn stalks'];
    const doNotAdd = ['Meat and fish', 'Dairy products', 'Oily foods', 'Pet waste', 'Diseased plants', 'Weeds with seeds', 'Plastic or glass', 'Charcoal ash'];

    return (
        <div className="container my-5">
            <div className="text-center mb-5">
                <div className="display-1 mb-3">🌱</div>
                <h1 className="display-4 fw-bold">Composting Guide</h1>
                <p className="lead text-muted">Turn your kitchen waste into nutrient-rich soil for your garden</p>
            </div>

            <div className="row mb-5">
                <div className="col-md-3 col-6 mb-3"><div className="card border-0 bg-light text-center h-100"><div className="card-body"><div className="display-3">🗑️</div><h5>Reduces Waste</h5></div></div></div>
                <div className="col-md-3 col-6 mb-3"><div className="card border-0 bg-light text-center h-100"><div className="card-body"><div className="display-3">💰</div><h5>Free Fertilizer</h5></div></div></div>
                <div className="col-md-3 col-6 mb-3"><div className="card border-0 bg-light text-center h-100"><div className="card-body"><div className="display-3">🌍</div><h5>Healthy Soil</h5></div></div></div>
                <div className="col-md-3 col-6 mb-3"><div className="card border-0 bg-light text-center h-100"><div className="card-body"><div className="display-3">🌿</div><h5>Reduces Methane</h5></div></div></div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0 pt-4">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item"><button className={`nav-link ${activeTab === 'steps' ? 'active text-success fw-bold' : ''}`} onClick={() => setActiveTab('steps')}>📋 Composting Steps</button></li>
                        <li className="nav-item"><button className={`nav-link ${activeTab === 'materials' ? 'active text-success fw-bold' : ''}`} onClick={() => setActiveTab('materials')}>🥬 Materials Guide</button></li>
                        <li className="nav-item"><button className={`nav-link ${activeTab === 'tips' ? 'active text-success fw-bold' : ''}`} onClick={() => setActiveTab('tips')}>💡 Pro Tips</button></li>
                    </ul>
                </div>
                <div className="card-body p-4">
                    {activeTab === 'steps' && (
                        <div className="row">
                            {steps.map(step => (
                                <div key={step.step} className="col-md-6 mb-4">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0"><div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}><span className="fs-3 text-white">{step.step}</span></div></div>
                                        <div className="flex-grow-1 ms-3"><h5 className="fw-bold">{step.title}</h5><p className="text-muted mb-0">{step.description}</p></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'materials' && (
                        <div>
                            <div className="row">
                                <div className="col-md-6 mb-4"><div className="card bg-success bg-opacity-10"><div className="card-body"><h4 className="text-success">🟢 Green Materials (Nitrogen)</h4>{greenMaterials.map((item, i) => <div key={i}>✓ {item}</div>)}</div></div></div>
                                <div className="col-md-6 mb-4"><div className="card bg-warning bg-opacity-10"><div className="card-body"><h4 className="text-warning">🟤 Brown Materials (Carbon)</h4>{brownMaterials.map((item, i) => <div key={i}>✓ {item}</div>)}</div></div></div>
                            </div>
                            <div className="card bg-danger bg-opacity-10"><div className="card-body"><h4 className="text-danger">❌ Do NOT Add These</h4><div className="row">{doNotAdd.map((item, i) => <div key={i} className="col-md-3">✗ {item}</div>)}</div></div></div>
                        </div>
                    )}
                    {activeTab === 'tips' && (
                        <div className="row">
                            <div className="col-md-4 mb-3"><div className="card h-100"><div className="card-body"><div className="display-4">📏</div><h5>Ratio Matters</h5><p>Maintain 2:1 ratio of browns to greens.</p></div></div></div>
                            <div className="col-md-4 mb-3"><div className="card h-100"><div className="card-body"><div className="display-4">✂️</div><h5>Chop It Up</h5><p>Smaller pieces decompose faster.</p></div></div></div>
                            <div className="col-md-4 mb-3"><div className="card h-100"><div className="card-body"><div className="display-4">💧</div><h5>Moisture Check</h5><p>Squeeze test: A few drops should come out.</p></div></div></div>
                            <div className="col-md-4 mb-3"><div className="card h-100"><div className="card-body"><div className="display-4">🔄</div><h5>Turn Regularly</h5><p>Mix your pile every 1-2 weeks.</p></div></div></div>
                            <div className="col-md-4 mb-3"><div className="card h-100"><div className="card-body"><div className="display-4">🌡️</div><h5>Temperature Check</h5><p>Hot center means active composting!</p></div></div></div>
                            <div className="col-md-4 mb-3"><div className="card h-100"><div className="card-body"><div className="display-4">⏰</div><h5>Patience Pays</h5><p>Compost is ready in 2-6 months.</p></div></div></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompostGuide;