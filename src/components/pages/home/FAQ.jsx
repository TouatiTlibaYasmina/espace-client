import React, { useState, useRef } from 'react';
import './FAQ.css';
import { 
  FaUser, FaKey, FaMobile, FaIdCard, FaEnvelope, 
  FaShieldAlt, FaWifi, FaBell, FaCreditCard, 
  FaExclamationTriangle, FaHeadset,
   FaThumbsUp, FaThumbsDown,
  FaChevronDown
} from 'react-icons/fa';

// Composant principal FAQ
const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('ACCOUNT');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const answerRefs = useRef([]);

  // Données des questions/réponses par catégorie
  const faqData = [
    {
      id: 'ACCOUNT',
      name: 'Compte & Connexion',
      icon: <FaUser className="category-icon" />,
      questions: [
        {
          id: 'account-1',
          question: 'Qu\'est-ce que l\'Espace Client Algérie Télécom ?',
          answer: 'L\'Espace Client est une plateforme en ligne qui vous permet de gérer facilement vos abonnements (Internet et Téléphonie), consulter vos factures, suivre votre consommation, effectuer des paiements et envoyer des réclamations.',
          icon: <FaUser />,
          keywords: ['espace client', 'présentation', 'fonctionnalités']
        },
        {
          id: 'account-2',
          question: 'Comment créer un compte sur l\'Espace Client ?',
          answer: (
            <>
              <ol className="faq-steps">
                <li>Cliquez sur "Créer un compte"</li>
                <li>Remplissez le formulaire avec vos informations personnelles et votre numéro de ligne</li>
                <li>Cliquez sur "Créer"</li>
              </ol>
              <p className="faq-note">Un email de confirmation vous sera envoyé pour activer votre compte.</p>
            </>
          ),
          icon: <FaUser />,
          keywords: ['création', 'inscription', 'nouveau compte']
        },
        {
          id: 'account-3',
          question: 'Comment me connecter à mon compte ?',
          answer: (
            <>
              <ol className="faq-steps">
                <li>Cliquez sur "Se connecter"</li>
                <li>Entrez votre adresse e-mail et votre mot de passe</li>
                <li>Si vous avez activé la double authentification (2FA), saisissez le code de vérification</li>
              </ol>
            </>
          ),
          icon: <FaKey />,
          keywords: ['connexion', 'login', 'se connecter']
        }
      ]
    },
    {
      id: 'SECURITY',
      name: 'Sécurité',
      icon: <FaShieldAlt className="category-icon" />,
      questions: [
        {
          id: 'security-1',
          question: 'Comment choisir un mot de passe sécurisé ?',
          answer: (
            <>
              <p>Votre mot de passe doit contenir :</p>
              <ul className="faq-list">
                <li>Minimum 10 caractères</li>
                <li>Une majuscule et une minuscule</li>
                <li>Au moins un chiffre</li>
                <li>Un caractère spécial (ex: !@#)</li>
              </ul>
              <div className="faq-examples">
                <p>✅ <strong>Fort</strong>: MotDePasse@2024</p>
                <p>❌ <strong>Faible</strong>: azerty123</p>
              </div>
            </>
          ),
          icon: <FaKey />,
          keywords: ['mot de passe', 'sécurité', 'connexion']
        },
        {
          id: 'security-2',
          question: 'Que faire si j\'ai oublié mon mot de passe ?',
          answer: (
            <>
              <ol className="faq-steps">
                <li>Cliquez sur "Mot de passe oublié ?"</li>
                <li>Entrez votre e-mail</li>
                <li>Vous recevrez un lien de réinitialisation par mail</li>
              </ol>
            </>
          ),
          icon: <FaKey />,
          keywords: ['mot de passe oublié', 'réinitialisation']
        }
      ]
    },
    {
      id: 'FORMAT',
      name: 'Formats Requis',
      icon: <FaIdCard className="category-icon" />,
      questions: [
        {
          id: 'format-1',
          question: 'Quel est le format requis pour le numéro de téléphone (numTel) ?',
          answer: (
            <>
              <p>Entrez un numéro algérien valide à 10 chiffres</p>
              <div className="faq-examples">
                <p>✅ <strong>Correct</strong>: 0551234567</p>
                <p>❌ <strong>Incorrect</strong>: +213551234567, 551234567</p>
              </div>
            </>
          ),
          icon: <FaMobile />,
          keywords: ['numéro', 'téléphone', 'format']
        },
        {
          id: 'format-2',
          question: 'Qu\'est-ce que le MSISDN ?',
          answer: 'C\'est le numéro de votre carte SIM, utilisé pour vous identifier. Il doit être unique et se trouve dans les paramètres du téléphone ou via votre opérateur.',
          icon: <FaMobile />,
          keywords: ['msisdn', 'carte sim', 'numéro']
        },
        {
          id: 'format-3',
          question: 'C\'est quoi le numéro client (numClient) ?',
          answer: 'Numéro qui vous identifie en tant que client. Vous le trouvez sur vos factures ou contrats.',
          icon: <FaIdCard />,
          keywords: ['numéro client', 'identification']
        },
        {
          id: 'format-4',
          question: 'Dois-je remplir le champ "mobile" ?',
          answer: 'Oui, c\'est votre numéro mobile secondaire. Il peut être le même ou différent du champ numTel.',
          icon: <FaMobile />,
          keywords: ['mobile', 'numéro secondaire']
        },
        {
          id: 'format-5',
          question: 'Quel format d\'email est accepté ?',
          answer: (
            <>
              <div className="faq-examples">
                <p>✅ <strong>Valide</strong>: exemple@gmail.com</p>
                <p>❌ <strong>Invalide</strong>: exemple@.com, exemple@com</p>
              </div>
            </>
          ),
          icon: <FaEnvelope />,
          keywords: ['email', 'format']
        }
      ]
    },
    {
      id: 'SUBSCRIPTION',
      name: 'Abonnements',
      icon: <FaWifi className="category-icon" />,
      questions: [
        {
          id: 'sub-1',
          question: 'Comment consulter mes abonnements ?',
          answer: (
            <>
              <ol className="faq-steps">
                <li>Rendez-vous dans votre espace client</li>
                <li>Sélectionnez "Abonnements" puis "Historique abonnements"</li>
                <li>Vous verrez tous vos abonnements téléphonie ou internet, actifs ou expirés</li>
              </ol>
            </>
          ),
          icon: <FaWifi />,
          keywords: ['abonnements', 'consulter', 'historique']
        },
        {
          id: 'sub-2',
          question: 'Vais-je être averti si mon abonnement expire ?',
          answer: 'Oui, vous recevrez une notification dans votre espace client avant l\'expiration.',
          icon: <FaBell />,
          keywords: ['expiration', 'notification']
        }
      ]
    },
    {
      id: 'PAYMENT',
      name: 'Paiements',
      icon: <FaCreditCard className="category-icon" />,
      questions: [
        {
          id: 'payment-1',
          question: 'Comment payer ma facture en ligne ?',
          answer: (
            <>
              <ol className="faq-steps">
                <li>Rendez-vous dans votre espace client</li>
                <li>Allez dans "Facture" dans le sidebar puis "Voir mes factures"</li>
                <li>Choisissez la facture à régler</li>
                <li>Cliquez sur "Payer"</li>
                <li>Sélectionnez une méthode de paiement : CIB, Edahabia</li>
                <li>Suivez les étapes de validation</li>
              </ol>
            </>
          ),
          icon: <FaCreditCard />,
          keywords: ['paiement', 'facture', 'en ligne']
        }
      ]
    },
    {
      id: 'SUPPORT',
      name: 'Support',
      icon: <FaHeadset className="category-icon" />,
      questions: [
        {
          id: 'support-1',
          question: 'Comment signaler un problème de connexion ou téléphonie ?',
          answer: (
            <>
              <ol className="faq-steps">
                <li>Allez dans "Réclamation" au sidebar puis "Ajouter une réclamation"</li>
                <li>Décrivez le problème et cliquez sur Envoyer</li>
                <li>Vous pouvez suivre le statut de votre réclamation dans "Voir mes réclamations"</li>
              </ol>
            </>
          ),
          icon: <FaExclamationTriangle />,
          keywords: ['problème', 'réclamation', 'signalement']
        },
        {
          id: 'support-2',
          question: 'Comment contacter le support client ?',
          answer: 'Depuis la page d\'accueil de l\'espace client, cliquez sur "Contact" au navbar. Vous trouverez numéro à appeler (service client Algérie Télécom).',
          icon: <FaHeadset />,
          keywords: ['support', 'contact', 'aide']
        }
      ]
    }
  ];

  // Gère l'ouverture/fermeture d'une question
  const toggleQuestion = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  // Récupère la catégorie active
  const activeData = faqData.find(cat => cat.id === activeCategory);

  return (
    <div className="faq-container">
      {/* En-tête de la FAQ */}
      <div className="faq-header">
        <p className="faq-subtitle">
          Trouvez rapidement les réponses à vos questions
        </p>
      </div>

      <div className="faq-layout">
        {/* Navigation des catégories */}
        <div className="faq-categories">
          <h3 className="faq-categories-title">
            Catégories
          </h3>
          
          <div className="faq-category-list">
            {faqData.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveQuestion(null);
                }}
                className={`faq-category-btn ${activeCategory === category.id ? 'active' : ''}`}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section des questions/réponses */}
        <div className="faq-questions-container">
          {activeData && (
            <>
              <h2 className="faq-category-title">
                <span className="category-icon">
                  {activeData.icon}
                </span>
                {activeData.name}
              </h2>

              <div className="faq-questions-list">
                {activeData.questions.map((question) => (
                  <div 
                    key={question.id}
                    className={`faq-item ${activeQuestion === question.id ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="faq-question"
                    >
                      <span className="question-icon">
                        {question.icon}
                      </span>
                      
                      <h4>{question.question}</h4>
                      
                      <FaChevronDown className="toggle-icon" />
                    </button>

                    {activeQuestion === question.id && (
                      <div className="faq-answer">
                        <div className="answer-content">
                          {question.answer}
                          
                          {/* Section de feedback */}
                          <div className="faq-feedback">
                            <p>Cette réponse vous a-t-elle aidé ?</p>
                            <div className="feedback-buttons">
                              <button>
                                <FaThumbsUp /> Oui
                              </button>
                              <button>
                                <FaThumbsDown /> Non
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;