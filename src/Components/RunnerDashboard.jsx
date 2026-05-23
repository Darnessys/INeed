import React, { useState } from 'react';
import './RunnerDashboard.css'; 

const RunnerDashboard = ({ runnerProfile }) => {
  // حطينا طلبات وهمية جاهزة عشان تتفرج على التصميم الملوكي من غير ما نكلم السيرفر الخربان
  const [pendingOrders, setPendingOrders] = useState([
    { id: 1, itemDescription: "علبة قطايف بالمكسرات وفانوس رمضان الفخم", deliveryFee: 50 },
    { id: 2, itemDescription: "طقم كيبورد وماوس جيمنج من كوكب زحل", deliveryFee: 75 },
    { id: 3, itemDescription: "كيلو كباب وكفتة ملوكي لزوم الأنتخة", deliveryFee: 40 }
  ]);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = (orderId) => {
    setIsAccepting(true);
    setTimeout(() => {
      alert("تم قبول الطلب بنجاح! بالتوفيق يا بطل.");
      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      setIsAccepting(false);
    }, 1000); // بيحاكي القبول في ثانية واحدة
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