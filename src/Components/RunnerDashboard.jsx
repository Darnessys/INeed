import React, { useEffect, useState } from 'react';
// جرب المسار ده بالظبط
import { watchForNewOrders, acceptOrder } from '../Services/OrderService';

const RunnerDashboard = ({ runnerProfile }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    // 1. المندوب بيبدأ يراقب الرف فور فتح الشاشة
    const unsubscribe = watchForNewOrders((orders) => {
      setPendingOrders(orders); // كل ما يحصل تغيير، الموظف بيبعت القائمة المحدثة
    });

    // 2. لما المندوب يقفل الشاشة، الموظف يبطل مراقبة عشان نوفر موارد الجهاز
    return () => unsubscribe();
  }, []);

  const handleAccept = async (orderId) => {
    setIsAccepting(true);
    try {
      await acceptOrder(orderId, runnerProfile.id);
      alert("تم قبول الطلب بنجاح! بالتوفيق يا بطل.");
    } catch (e) {
      alert("حدث خطأ أثناء قبول الطلب.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="runner-dashboard">
      <h2>طلبات في انتظارك:</h2>
      {pendingOrders.length === 0 ? (
        <p>لا توجد طلبات جديدة حالياً، استرح قليلاً!</p>
      ) : (
        pendingOrders.map((order) => (
          <div key={order.id} className="order-card" style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
            <p><strong>الطلب:</strong> {order.itemDescription}</p>
            <p><strong>قيمة التوصيل:</strong> {order.deliveryFee} جنيه</p>
            <button 
              disabled={isAccepting} 
              onClick={() => handleAccept(order.id)}
            >
              {isAccepting ? "جاري القبول..." : "قبول الطلب"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RunnerDashboard;