import React, { useState } from 'react';
import '../styles/help.css'
import arrow from "../icons/Misc/Arrow.png"
import Return from '../components/return';


function FAQ() {

  const faqData = [
    {
      question: '• How can I track a vessel of my choosing on the live map?',
      answer: 'Use the search bar at the top of the live map page to enter the vessel’s name or IMO number, then click on it to follow it in real-time.'
    },
    {
      question: '• How can I save vessels I want, to create a fleet?',
      answer: 'Click the star icon next to the vessel’s name to add it to your favorites or create a custom fleet in your user dashboard.'
    },
    {
      question: '• How can I add new vessels to a fleet?',
      answer: 'Go to your fleet settings, select an existing fleet, and use the “Add Vessel” option to search and include new ones.'
    },
    {
      question: '• How can I see a vessel\'s next destination?',
      answer: 'On the vessel details page, under voyage info, you’ll find the next scheduled port along with ETA.'
    },
    {
      question: '• Why cannot I see a vessel on the live map?',
      answer: 'The vessel may be out of range, turned off its AIS transponder, or not broadcasting due to technical issues.'
    },
    {
      question: '• How can I change my vessel’s name or other information?',
      answer: 'You can request changes via your vessel management panel, subject to verification by our support team.'
    },
    {
      question: '• How can I monitor a vessel’s cargo throughout a voyage?',
      answer: 'Our Cargo Monitoring feature provides real-time cargo updates if supported by the vessel’s systems and your subscription plan.'
    }
  ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
      setActiveIndex(index === activeIndex ? null : index);
    };

    return (
      <div className="help-container">
          <div className="help-card-wrapper">
            <div className="help-card">
              <div className="help-form">
                  <div className="faq-container">
                    {faqData.map((item, index) => (
                      <div key={index} className="faq-item">
                        <button className="faq-question" onClick={() => toggle(index)}>
                          {item.question}
                          <img
                            src={arrow} // adjust path as needed
                            alt="arrow"
                            className={`faq-arrow ${activeIndex === index ? 'open' : ''}`}/>
                        </button>
                        {activeIndex === index && (
                          <div className="faq-answer">
                            <div className='faq-answer-sentence'>Answer:</div> {item.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
      </div>
    );
}

export default FAQ;
