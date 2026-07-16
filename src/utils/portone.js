const IMP_STORE_ID = 'imp37935403';

const PG_MAP = {
  card: 'html5_inicis',
  kakaopay: 'kakaopay.TC0ONETIME',
  naverpay: 'naverpay.partner-naverpay',
  tosspay: 'tosspay.tosspay',
};

export function requestPayment({ method, name, amount, buyerEmail, buyerName, buyerTel }) {
  return new Promise((resolve, reject) => {
    if (!window.IMP) {
      reject(new Error('PortOne SDK가 로드되지 않았습니다.'));
      return;
    }

    window.IMP.init(IMP_STORE_ID);

    const payParams = {
      pg: PG_MAP[method] || PG_MAP.card,
      pay_method: 'card',
      merchant_uid: `merchant_${Date.now()}`,
      name,
      amount,
      buyer_email: buyerEmail,
      buyer_name: buyerName,
      buyer_tel: buyerTel,
    };

    window.IMP.request_pay(payParams, (rsp) => {
      if (rsp.success) {
        resolve(rsp);
      } else {
        reject(new Error(rsp.error_msg || '결제에 실패했습니다.'));
      }
    });
  });
}

export function generateBookingId() {
  return `RES-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
}
