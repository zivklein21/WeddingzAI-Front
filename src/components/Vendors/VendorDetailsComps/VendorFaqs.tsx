import React, {useRef} from 'react';
import styles from '../vendors.module.css';
import { Faq } from '../../../types/Vendor';

interface Props {
  faqs: Faq[];
  openFaq: number | null;
  setOpenFaq: React.Dispatch<React.SetStateAction<number | null>>;
}

const VendorFaqs: React.FC<Props> = ({ faqs, openFaq, setOpenFaq }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className={styles.content} ref={contentRef}>
      <section id="faqs" className={styles.section}>
        <h2>FAQs</h2>
        {faqs.map((f, i) => (
          <div key={i} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span className={styles.toggle}>
                {openFaq === i ? '–' : '+'}
              </span>
              {f.question}
            </button>
            {openFaq === i && (
              <p className={styles.faqAnswer}>{f.answer}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default VendorFaqs;