// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      faqs: [
        {
          question: "What is Onlyfundr?",
          answer:
            "Onlyfundr is a platform for creating anonymous crowdfunding campaigns to raise money for any goal.",
        },
        {
          question: "How does Onlyfundr work?",
          answer:
            "Create a campaign and receive donations. Donors can join a private chat for each campaign, where interaction continues between the campaign owner and users.",
        },
        {
          question: "What information is visible to other users?",
          answer:
            "Only your username, trust score, and active campaigns are visible.",
        },
        {
          question: "How is my anonymity protected?",
          answer:
            "We don’t store IP addresses or ask for personal information. All transactions are processed through an external Monero (XMR) wallet for privacy. Your trace is lost way before any transaction reaches the website.",
        },
        {
          question: "Why is XMR used for anonymous transactions?",
          answer:
            "Monero (XMR) hides the sender, receiver, and transaction details using advanced encryption methods, making transactions untraceable and ensuring full anonymity.",
        },
        {
          question: "Are there any fees?",
          answer:
            "A small fee is applied to cover third-party transaction services used to ensure anonymity and balance stability.",
        },
        {
          question: "How do you prevent fraud or scams?",
          answer:
            "Each user has a trust score based on their campaign history. It's up to users to decide whether to trust a campaign, as we do not offer compensation for losses.",
        },
        {
          question: "What types of campaigns are allowed?",
          answer:
            "Almost any campaign is allowed. Some campaigns may be removed, with refunds issued to donors. Campaigns harming minors, animals or anything else that is morally disgusting will not be refunded and get you banned for lifetime.",
        },
        {
          question: "What payment methods are accepted?",
          answer:
            "Currently, we accept almost all cryptocurrencies. You don't know how to use them? It's 2024, go learn it, it's really easy. Anonymous card payments will be added soon.",
        },
        {
          question: "What happens if my campaign doesn’t reach its goal?",
          answer:
            "The campaign remains open. An auto-close feature will soon be available for campaigns that don’t meet their goals within a set time.",
        },
        {
          question: "Is there a minimum or maximum donation amount?",
          answer:
            "The minimum donation is 1 USD. The minimum top-up for your balance is 25 USD.",
        },
        {
          question: "Is there customer support available?",
          answer: "No.",
        },
      ],
      logout: "Logout",
      word1: "Campaigns",
      word2: "Make Money",
      word3: "FAQS",
      word4: "Profile",
      word5: "Balance",
      word6: "All Campaigns",
      word7: "Search by title or description",
      word8: "Category",
      word9: "Sub-Category",
      word10: "Active",
      word11: "Inactive",
      word12: "Newest",
      word13: "Goal Amount",
      word14: "Goal Amount Percentage",
      word15: "Number of Participants",
      word16: "Turn your campaign into profit",
      word17: "Make Money as a Creator",
      word18:
        "With Onlyfundr you can not only raise funds but also earn profits directly from your crowdfunding campaign.",
      word19: "Start Earning Now",
      word20: "Your Success Starts Here",
      word21: "Ready to start earning?",
      word22: "Create a Campaign",
      word23: "Set Your Goal and Earn More",
      word24: "Maximize Your Earnings",
      word25:
        "Set your campaign goal and add an optional flat fee that donors pay. This helps you profit from the effort you invest in promoting your campaign.",
      word26: "Reach Your Goal, and Earn Extra",
      word27:
        "With the flat fee, donors contribute to your project and your success, rewarding you directly for your hard work.",
      word28: "Earn While Making a Difference",
      word29:
        "This approach ensures you bring your project to life while also earning extra income.",
      word30: "Frequently Asked Questions",
      word31: "Please log in to participate in the chat.",
      word32: "Username",
      word33: "Password",
      word34: "Proceed",
      word35: "Log In",
      word36: "Sign Up",
      word37: "Enter your username",
      word38: "Enter your password",
      word39: "Don't have an account yet?",
      word40: "Login",
      word41: "Create an Account",
      word42: "Sign Up Now",
      word43: "Already have an account?",
      word44: "Login",
      word45: "Join",
      word46: "Closed",
      word47: "Contribute",
      word48: "Raised",
      word49: "Goal",
      word50: "Created By",
      word51: "No Rating Yet",
      word52: "Remaining Slots",
      word53: "Expires On",
      word54: "Please log in to contribute.",
      word55: "Logged in successfully!",
      word56: "Welcome",
      word57: "Change Password",
      word58: "Create Payout",
      word59: "Add Balance",
      word60: "Pending Actions",
      word61: "My Contributions",
      word62: "Campaign ID",
      word63: "Campaign Title",
      word64: "Date of Contribution",
      word65: "Amount",
      word66: "Rated",
      word67: "My Campaigns",
      word68: "My Transactions",
      word69: "No transactions found.",
      word70: "Crypto",
      word71: "(Recommended)",
      word72: "Anonymous",
      word73: "No KYC",
      word74: "10%~ Fee",
      word75:
        "Your payment goes through an XMR swap before it reaches Onlyfundr, which is why you remain 100% anonymous.",
      word76: "Card & Bank Transfer",
      word77: "(Not Recommended)",
      word78: "Anonymous",
      word79: "First Time KYC",
      word80: "20%~ Fee",
      word81:
        "You have to confirm your identity once at Swaps.app. Your payment will still go through an XMR swap before it reaches Onlyfundr, so you remain 100% anonymous.",
      word82: "Proceed with Crypto",
      word83: "Proceed with Card/Bank Transfer",
      word84: "No actions pending.",
      word85: "Cancel",
      word86: "Please enter a valid amount",
      word87: "Fill the Form Below",
      word88: "To create a new campaign",
      word89: "Title",
      word90: "Enter campaign title",
      word91: "Description",
      word92: "Enter the campaign description",
      word93: "Goal - USD",
      word94: "Enter your campaign goal",
      word95: "Number of Participants",
      word96: "Enter the number of participant slots",
      word97: "Total Profit - USD",
      word98: "Category",
      word99: "Sub-Category",
      word100:
        "Note: The campaign creator must make the first contribution. Therefore, make sure you have enough balance to create the campaign.",
      word101: "Campaign Image",
      word102: "Upload File",
      word103: "No file selected",
      word104: "Create Campaign",
      word105: "Enter a valid campaign title",
      word106: "Enter a valid campaign description",
      word107: "Goal must be at least 1 USD",
      word108: "Enter the number of participant slots",
      word109: "Please select a category",
      word110: "Please select a sub-category",
      word111: "Please upload a campaign image",
      word112: "Contribution per head",
      word113:
        "Profit fee is more than 30% of base contribution. Please reduce the profit amount or increase the number of participants.",
      word114: "Are you sure you want to contribute ",
      word115: " Contribution",
      word116: "Service fee",
      word117: "Profit fee",
      word118: "Yes, Join",
      word119: "Cancel",
      word120: "Password must be at least 7 characters long",
    },
  },
  de: {
    translation: {
      faqs: [
        {
          question: "Was ist Onlyfundr?",
          answer:
            "Onlyfundr ist eine Plattform für anonyme Crowdfunding-Kampagnen, um Geld für jedes Ziel zu sammeln.",
        },
        {
          question: "Wie funktioniert Onlyfundr?",
          answer:
            "Erstelle eine Kampagne und erhalte Spenden. Spender können an einem privaten Chat für jede Kampagne teilnehmen, in dem die Interaktion zwischen Kampagnenbesitzer und Nutzern fortgesetzt wird.",
        },
        {
          question: "Welche Informationen sind für andere Nutzer sichtbar?",
          answer:
            "Nur dein Benutzername, dein Vertrauensscore und deine aktiven Kampagnen sind sichtbar.",
        },
        {
          question: "Wie wird meine Anonymität geschützt?",
          answer:
            "Wir speichern keine IP-Adressen und fragen nicht nach persönlichen Informationen. Alle Transaktionen laufen über eine externe Monero (XMR)-Wallet für Datenschutz. Deine Spur verschwindet lange bevor sie die Website erreicht.",
        },
        {
          question: "Warum wird XMR für anonyme Transaktionen verwendet?",
          answer:
            "Monero (XMR) verbirgt Sender, Empfänger und Transaktionsdetails durch fortgeschrittene Verschlüsselungsmethoden, wodurch Transaktionen nicht zurückverfolgbar und vollständig anonym bleiben.",
        },
        {
          question: "Gibt es Gebühren?",
          answer:
            "Eine kleine Gebühr wird erhoben, um die Kosten der Drittanbieter-Transaktionsdienste zur Sicherung der Anonymität und Stabilität zu decken.",
        },
        {
          question: "Wie wird Betrug oder Missbrauch verhindert?",
          answer:
            "Jeder Nutzer hat einen Vertrauensscore basierend auf seiner Kampagnenhistorie. Es liegt an den Nutzern, einer Kampagne zu vertrauen; wir bieten keinen Ausgleich für Verluste.",
        },
        {
          question: "Welche Arten von Kampagnen sind erlaubt?",
          answer:
            "Fast alle Kampagnen sind erlaubt. Manche Kampagnen können entfernt werden, wobei Spender eine Rückerstattung erhalten. Kampagnen, die Minderjährigen, Tieren oder anderen moralisch verwerflichen Zielen schaden, werden nicht erstattet und führen zu einem lebenslangen Bann.",
        },
        {
          question: "Welche Zahlungsmethoden werden akzeptiert?",
          answer:
            "Derzeit akzeptieren wir fast alle Kryptowährungen. Du weißt nicht, wie man sie nutzt? Es ist 2024 – lerne es, es ist wirklich einfach. Anonyme Kartenzahlungen werden bald hinzugefügt.",
        },
        {
          question:
            "Was passiert, wenn meine Kampagne ihr Ziel nicht erreicht?",
          answer:
            "Die Kampagne wird nach 90 Tagen geschlossen. Du und alle Spender erhalten ihre Beiträge zurück.",
        },
        {
          question: "Gibt es einen Mindest- oder Höchstbetrag für Spenden?",
          answer:
            "Die Mindestspende beträgt 1 USD. Die Mindestaufladung deines Guthabens beträgt 25 USD.",
        },
        {
          question: "Gibt es Kundensupport?",
          answer: "Nein.",
        },
      ],
      logout: "Ausloggen",
      word1: "Kampagnen",
      word2: "Geld verdienen",
      word3: "F&A",
      word4: "Profil",
      word5: "Guthaben",
      word6: "Alle Kampagnen",
      word7: "Suche nach Titel oder Beschreibung",
      word8: "Kategorie",
      word9: "Unterkategorie",
      word10: "Aktiv",
      word11: "Inaktiv",
      word12: "Neu",
      word13: "Zielbetrag",
      word14: "Zielbetrag in Prozent",
      word15: "Anzahl der Teilnehmer",
      word16: "Mach Gewinn aus deiner Kampagne",
      word17: "Verdiene Geld als Ersteller",
      word18:
        "Mit Onlyfundr kannst du nicht nur Geld sammeln, sondern auch direkt mit deiner Crowdfunding-Kampagne Geld verdienen.",
      word19: "Jetzt Geld Verdienen",
      word20: "Dein Erfolg startet hier",
      word21: "Bereit zu verdienen?",
      word22: "Kampagne erstellen",
      word23: "Lege dein Ziel fest und verdiene mehr",
      word24: "Maximiere Deine Gewinne",
      word25:
        "Lege dein Kampagnenziel fest und füge eine optionale Gewinngebühr hinzu, die die Spender zahlen. So profitierst du von dem Aufwand, den du in die Kampagne steckst.",
      word26: "Erreiche dein Ziel und verdiene dazu",
      word27:
        "Mit der Gewinngebühr tragen die Spender zu deinem Aufwand bei und belohnen dich direkt für deine Arbeit.",
      word28: "Verdienen und erreiche dein Ziel",
      word29:
        "Dieser Ansatz gewährleistet, dass deine Kampagen spaß machen und du gleichzeitig ein zusätzliches Einkommen verdienst.",
      word30: "Fragen & Antworten",
      word31: "Bitte melde dich an, um am Chat teilzunehmen.",
      word32: "Nutzername",
      word33: "Passwort",
      word34: "Weiter",
      word35: "Einloggen",
      word36: "Registrieren",
      word37: "Gib deinen Nutzernamen ein",
      word38: "Gib dein Passwort ein",
      word39: "Noch kein Konto?",
      word40: "Login",
      word41: "Konto erstellen",
      word42: "Jetzt registrieren",
      word43: "Bereits ein Konto?",
      word44: "Einloggen",
      word45: "Beitreten",
      word46: "Geschlossen",
      word47: "Spende",
      word48: "Gesammelt",
      word49: "Ziel",
      word50: "Erstellt Von",
      word51: "Noch Keine Bewertung",
      word52: "Verfügbare Plätze",
      word53: "Läuft Aus Am",
      word54: "Bitte logge dich ein um zu spenden.",
      word55: "Erfolgreich eingeloggt!",
      word56: "Willkommen",
      word57: "Passwort Ändern",
      word58: "Auszahlung Anfragen",
      word59: "Guthaben Aufladen",
      word60: "Laufende Aktionen",
      word61: "Meine Spenden",
      word62: "Kampagnen ID",
      word63: "Kampagnen Titel",
      word64: "Spendedatum",
      word65: "Betrag",
      word66: "Bewertet",
      word67: "Meine Kampagnen",
      word68: "Meine Transaktionen",
      word69: "Keine Transaktionen gefunden.",
      word70: "Krypto",
      word71: "(Empfohlen)",
      word72: "Anonym",
      word73: "Kein KYC",
      word74: "~10 % Gebühr",
      word75:
        "Deine Zahlung durchläuft einen XMR-Swap, bevor sie Onlyfundr erreicht, weshalb du 100 % anonym bleibst.",
      word76: "Karte & Banküberweisung",
      word77: "(Nicht empfohlen)",
      word78: "Anonym",
      word79: "Einmaliges KYC",
      word80: "~20 % Gebühr",
      word81:
        "Du musst deine Identität einmalig bei Swaps.app bestätigen. Deine Zahlung durchläuft trotzdem einen XMR-Swap, bevor sie Onlyfundr erreicht, sodass du 100 % anonym bleibst.",
      word82: "Weiter mit Krypto",
      word83: "Weiter mit Karte/Banküberweisung",
      word84: "Keine ausstehenden Aktionen.",
      word85: "Abbrechen",
      word86: "Bitte gib einen gültigen Betrag ein.",
      word87: "Fülle das Formular aus",
      word88: "Um eine neue Kampagne zu erstellen",
      word89: "Titel",
      word90: "Kampagnen Titel eingeben",
      word91: "Beschreibung",
      word92: "Kampagnen Beschreibung eingeben",
      word93: "Ziel - USD",
      word94: "Gib dein Kampagnen Ziel ein",
      word95: "Teilnehmer Anzahl",
      word96: "Gib die Menge an Plätzen für die Kampagne ein",
      word97: "Gewünschter Profit - USD",
      word98: "Kategorie",
      word99: "Unterkategorie",
      word100:
        "Hinweis: Der Kampagnenersteller muss den ersten Beitrag leisten. Stelle daher sicher, dass du ausreichend Guthaben hast, um die Kampagne zu erstellen.",
      word101: "Kampagnen Thumbnail",
      word102: "Datei hochladen",
      word103: "Keine Datei ausgewählt",
      word104: "Kampagne erstellen",
      word105: "Gib den Kampagnentitel ein",
      word106: "Gib die Kampagnenbeschreibung ein",
      word107: "Das Ziel muss mindestens 1 USD betragen",
      word108: "Gib die Anzahl der Teilnehmerplätze ein",
      word109: "Bitte wähle eine Kategorie aus",
      word110: "Bitte wähle eine Unterkategorie aus",
      word111: "Bitte lade ein Kampagnenbild hoch",
      word112: "Beitrag pro Person",
      word113:
        "Die Gewinngebühr beträgt mehr als 30 % des Basisbeitrags. Bitte reduziere den gewünschten Profit oder erhöhe die Teilnehmeranzahl.",
      word114: "Bist du sicher, dass du spenden willst ",
      word115: " Beteiligung",
      word116: "Platformgebühr",
      word117: "Gewinnzuschlag",
      word118: "Ja, Spenden",
      word119: "Abbrechen",
      word120: "Das Passwort muss mindestens 7 Zeichen lang sein.",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
