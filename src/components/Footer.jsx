import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      title: 'التسوق',
      items: ['غرف معيشة', 'غرف نوم', 'غرف طعام', 'مكاتب', 'ديكور']
    },
    {
      title: 'خدمة العملاء',
      items: ['الشحن والتوصيل', 'الإرجاع والاستبدال', 'تتبع الطلب', 'الأسئلة الشائعة']
    },
    {
      title: 'الشركة',
      items: ['من نحن', 'فروعنا', 'المدونة', 'تواصل معنا']
    }
  ];

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-mark">MF</span>
              <div>
                <h3>الأثاث العصري</h3>
                <p>Modern Furniture</p>
              </div>
            </div>

            <p className="footer-description">
              نوفر أثاثا عصريا بتصميمات هادئة وخامات موثوقة، مع تجربة شراء سهلة من الاختيار حتى التوصيل.
            </p>

            <div className="social-links">
              <a href="#facebook">Facebook</a>
              <a href="#instagram">Instagram</a>
              <a href="#youtube">YouTube</a>
            </div>
          </div>

          {links.map((section) => (
            <div key={section.title} className="footer-column">
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#products">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-column footer-contact">
            <h4>تواصل معنا</h4>
            <p>الرياض، حي الملك فهد، المملكة العربية السعودية</p>
            <p>+966 50 123 4567</p>
            <p>info@furniture.sa</p>
            <p>السبت - الخميس: 9 صباحا - 10 مساء</p>
          </div>
        </div>

        <div className="footer-middle">
          <div>
            <h4>طرق الدفع</h4>
            <div className="payment-methods">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Mada</span>
              <span>Apple Pay</span>
            </div>
          </div>

          <div>
            <h4>نوصّل إلى</h4>
            <div className="delivery-cities">
              <span>الرياض</span>
              <span>جدة</span>
              <span>الدمام</span>
              <span>مكة</span>
              <span>المدينة</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} الأثاث العصري. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">سياسة الخصوصية</a>
            <a href="#terms">الشروط والأحكام</a>
            <a href="#sitemap">خريطة الموقع</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
