import React, { useState, useRef } from 'react';
import { motion } from "framer-motion";
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const answerRefs = useRef([]);
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    if (answerRefs.current[index] && activeIndex !== index) {
        answerRefs.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
};

  const faqData = [
    { question: "Qu’est-ce que l’Espace Client ?", answer: "L’Espace Client est une plateforme sécurisée qui vous permet de gérer vos services Algérie Télécom à tout moment : consulter vos factures, suivre vos consommations, recharger en ligne, et bien plus." },
    { question: "Comment créer un compte Espace Client ?", answer: "C’est simple ! Cliquez sur “Créer Espace Client” dans le menu, entrez vos informations personnelles et suivez les instructions. Vous recevrez un email de confirmation pour activer votre compte." },
    { question: "Que faire si j’ai oublié mon mot de passe ?", answer: "Cliquez sur “Mot de passe oublié” sur la page de connexion, puis suivez les étapes pour réinitialiser votre mot de passe via votre adresse email" },
    { question: "Puis-je recharger ma connexion depuis l’Espace Client ?", answer: "Oui. Une fois connecté, rendez-vous dans la section “e-Paiement” pour acheter des recharges Internet ou régler vos factures, en toute sécurité." },

   
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-title">On répond à vos questions.</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <motion.div
              className="faq-question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => toggleAnswer(index)}
            >
              <h3>{item.question}</h3>
            </motion.div>

            <motion.div
              className="faq-answer"
              initial={{ height: 0 }}
              animate={{ height: activeIndex === index ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>{item.answer}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
