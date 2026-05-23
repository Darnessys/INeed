import React, { useEffect, useState } from 'react';
// استدعاء ملف التنسيق الملوكي الجديد
import './RunnerDashboard.css'; 
import { watchForNewOrders, acceptOrder } from '../Services/OrderService';

const RunnerDashboard = ({ runnerProfile }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const unsubscribe = watchForNewOrders((orders) => {
      setPendingOrders(orders); 
    });
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
        <p className="no-orders-msg">لا توجد طلبات جديدة حالياً، استرح قليلاً! ☕</p>
      ) : (
        pendingOrders.map((order) => (
          <div key={order.id} className="order-card">
            <p><strong>الطلب:</strong> {order.itemDescription}</p>
            <p>
              <strong>قيمة التوصيل:</strong> 
              <span className="delivery-fee-badge">{order.deliveryFee} جنيه</span>
            </p>
            <button 
              className="accept-btn"
              disabled={isAccepting} 
              onClick={() => handleAccept(order.id)}
            >
              {isAccepting ? "جاري القبول..." : "قبول الطلب 🚀"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RunnerDashboard;