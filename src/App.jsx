import React, { useState } from 'react';
import RunnerDashboard from './Components/RunnerDashboard'; // الـ C كابيتال ومظبوطة
import OrderForm from './Components/OrderForm';             // المكون الحقيقي للعميل منور وجاهز!

function App() {
  // 'client' هي الشاشة الافتراضية أول ما تفتح
  const [userRole, setUserRole] = useState('client');

  // بروفايل تجريبي للمندوب
  const fakeRunner = { id: "runner_71", name: "كابتن ضياء" };

  return (
    <div className="app-container" style={{ direction: 'rtl', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      
      {/* شريط التنقل التجريبي الفخم فوق */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '12px', 
        background: '#4a148c', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <button 
          onClick={() => setUserRole('client')}
          style={{
            padding: '10px 25px',
            borderRadius: '20px',
            border: 'none',
            fontWeight: 'bold',
            backgroundColor: userRole === 'client' ? '#fff' : '#7b1fa2',
            color: userRole === 'client' ? '#4a148c' : '#fff',
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          🛒 شاشة العميل (OrderForm)
        </button>
        
        <button 
          onClick={() => setUserRole('runner')}
          style={{
            padding: '10px 25px',
            borderRadius: '20px',
            border: 'none',
            fontWeight: 'bold',
            backgroundColor: userRole === 'runner' ? '#fff' : '#7b1fa2',
            color: userRole === 'runner' ? '#4a148c' : '#fff',
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          🏍️ شاشة المندوب
        </button>
      </div>

      {/* منطقة عرض الشاشات التفاعلية */}
      <div style={{ padding: '20px' }}>
        {userRole === 'client' ? (
          /* هنا استدعينا شاشة العميل الحقيقية.. السطر فوق مش هيبقى باهت تاني! */
          <OrderForm />
        ) : (
          /* شاشة المندوب الملوكية */
          <RunnerDashboard runnerProfile={fakeRunner} />
        )}
      </div>

    </div>
  );
}

export default App;