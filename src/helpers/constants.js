/* -----------------------------------------------------------------------------------------
    THSI FILE CONTAINS SOME STATIC DATA TO FILL SOME DIFFERENT COMPONENTS
----------------------------------------------------------------------------------------- */

import React from "react";
import { MdOutlineBiotech, MdInsertChart, MdSchool } from "react-icons/md";
import { RiMentalHealthLine } from "react-icons/ri";
import { FaBuilding } from "react-icons/fa";
import { IoPeopleCircleOutline } from "react-icons/io5";

// FUNDRAISE CATEGORIES
export const categories = [
  {
    label: "Technology",
    value: "Technology",
    icon: <MdOutlineBiotech size={30} />,
  },
  { label: "Health", value: "Health", icon: <RiMentalHealthLine size={30} /> },
  { label: "Finance", value: "Finance", icon: <MdInsertChart size={30} /> },
  { label: "Realestate", value: "Realestate", icon: <FaBuilding size={30} /> },
  { label: "Education", value: "Education", icon: <MdSchool size={30} /> },
  {
    label: "Charity",
    value: "Charity",
    icon: <IoPeopleCircleOutline size={30} />,
  },
];

/* FAQS LIST - ADD OR DELETE FROM THEM AS YOU NEED */
export const FAQS = [
  {
    question: "What is Onlyfundr?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Onlyfundr is a platform for creating anonymous crowdfunding campaigns
          to raise money for any goal.
        </p>
      </div>
    ),
  },
  {
    question: "How does Onlyfundr work?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Create a campaign and receive donations. Donors can join a private
          chat for each campaign, where interaction continues between the
          campaign owner and users.
        </p>
      </div>
    ),
  },
  {
    question: "What information is visible to other users?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Only your username, trust score, and active campaigns are visible.
        </p>
      </div>
    ),
  },
  {
    question: "How is my anonymity protected?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          We don’t store IP addresses or ask for personal information. All
          transactions are processed through an external Monero (XMR) wallet for
          privacy. Your trace is lost way before any transaction reaches the
          website.
        </p>
      </div>
    ),
  },
  {
    question: "Why is XMR used for anonymous transactions?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Monero (XMR) hides the sender, receiver, and transaction details using
          advanced encryption methods, making transactions untraceable and
          ensuring full anonymity.
        </p>
      </div>
    ),
  },
  {
    question: "Are there any fees?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          A small fee is applied to cover third-party transaction services used
          to ensure anonymity and balance stability.
        </p>
      </div>
    ),
  },
  {
    question: "How do you prevent fraud or scams?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Each user has a trust score based on their campaign history. It's up
          to users to decide whether to trust a campaign, as we do not offer
          compensation for losses.
        </p>
      </div>
    ),
  },
  {
    question: "What types of campaigns are allowed?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Almost any campaign is allowed. Some campaigns may be removed, with
          refunds issued to donors. Campaigns harming minors, animals or
          anything else that is morally disgusting will not be refunded and get
          you banned for lifetime.
        </p>
      </div>
    ),
  },
  {
    question: "What payment methods are accepted?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          Currently, we accept almost all cryptocurrencies. You don't know how
          to use them? It's 2024, go learn it, it's really easy. Anonymous card
          payments will be added soon.
        </p>
      </div>
    ),
  },
  {
    question: "What happens if my campaign doesn’t reach its goal?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          The campaign remains open. An auto-close feature will soon be
          available for campaigns that don’t meet their goals within a set time.
        </p>
      </div>
    ),
  },
  {
    question: "Is there a minimum or maximum donation amount?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">
          The minimum donation is $1. The minimum top-up for your balance is
          $25.
        </p>
      </div>
    ),
  },
  {
    question: "Is there customer support available?",
    answer: (
      <div className="text-muted">
        <p className="mb-2">No.</p>
      </div>
    ),
  },
];

export const countries = [
  { label: "Afghanistan", value: "AF" },
  { label: "Åland Islands", value: "AX" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "American Samoa", value: "AS" },
  { label: "AndorrA", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Anguilla", value: "AI" },
  { label: "Antarctica", value: "AQ" },
  { label: "Antigua and Barbuda", value: "AG" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Aruba", value: "AW" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Barbados", value: "BB" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bermuda", value: "BM" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia", value: "BO" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Bouvet Island", value: "BV" },
  { label: "Brazil", value: "BR" },
  { label: "British Indian Ocean Territory", value: "IO" },
  { label: "Brunei Darussalam", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Cambodia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Cape Verde", value: "CV" },
  { label: "Cayman Islands", value: "KY" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "China", value: "CN" },
  { label: "Christmas Island", value: "CX" },
  { label: "Cocos (Keeling) Islands", value: "CC" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo", value: "CG" },
  { label: "Congo, The Democratic Republic of the", value: "CD" },
  { label: "Cook Islands", value: "CK" },
  { label: "Costa Rica", value: "CR" },
  { label: "Cote D'Ivoire", value: "CI" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Cyprus", value: "CY" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Denmark", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominica", value: "DM" },
  { label: "Dominican Republic", value: "DO" },
  { label: "Ecuador", value: "EC" },
  { label: "Egypt", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "Equatorial Guinea", value: "GQ" },
  { label: "Eritrea", value: "ER" },
  { label: "Estonia", value: "EE" },
  { label: "Ethiopia", value: "ET" },
  { label: "Falkland Islands (Malvinas)", value: "FK" },
  { label: "Faroe Islands", value: "FO" },
  { label: "Fiji", value: "FJ" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "French Guiana", value: "GF" },
  { label: "French Polynesia", value: "PF" },
  { label: "French Southern Territories", value: "TF" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Germany", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Gibraltar", value: "GI" },
  { label: "Greece", value: "GR" },
  { label: "Greenland", value: "GL" },
  { label: "Grenada", value: "GD" },
  { label: "Guadeloupe", value: "GP" },
  { label: "Guam", value: "GU" },
  { label: "Guatemala", value: "GT" },
  { label: "Guernsey", value: "GG" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Guyana", value: "GY" },
  { label: "Haiti", value: "HT" },
  { label: "Heard Island and Mcdonald Islands", value: "HM" },
  { label: "Holy See (Vatican City State)", value: "VA" },
  { label: "Honduras", value: "HN" },
  { label: "Hong Kong", value: "HK" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran, Islamic Republic Of", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Isle of Man", value: "IM" },
  { label: "Italy", value: "IT" },
  { label: "Jamaica", value: "JM" },
  { label: "Japan", value: "JP" },
  { label: "Jersey", value: "JE" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kiribati", value: "KI" },
  { label: "Korea, Democratic People'S Republic of", value: "KP" },
  { label: "Korea, Republic of", value: "KR" },
  { label: "Kuwait", value: "KW" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Lao People'S Democratic Republic", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Lesotho", value: "LS" },
  { label: "Liberia", value: "LR" },
  { label: "Libyan Arab Jamahiriya", value: "LY" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Macao", value: "MO" },
  { label: "Macedonia, The Former Yugoslav Republic of", value: "MK" },
  { label: "Madagascar", value: "MG" },
  { label: "Malawi", value: "MW" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Martinique", value: "MQ" },
  { label: "Mauritania", value: "MR" },
  { label: "Mauritius", value: "MU" },
  { label: "Mayotte", value: "YT" },
  { label: "Mexico", value: "MX" },
  { label: "Micronesia, Federated States of", value: "FM" },
  { label: "Moldova, Republic of", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mongolia", value: "MN" },
  { label: "Montserrat", value: "MS" },
  { label: "Morocco", value: "MA" },
  { label: "Mozambique", value: "MZ" },
  { label: "Myanmar", value: "MM" },
  { label: "Namibia", value: "NA" },
  { label: "Nauru", value: "NR" },
  { label: "Nepal", value: "NP" },
  { label: "Netherlands", value: "NL" },
  { label: "Netherlands Antilles", value: "AN" },
  { label: "New Caledonia", value: "NC" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Niger", value: "NE" },
  { label: "Nigeria", value: "NG" },
  { label: "Niue", value: "NU" },
  { label: "Norfolk Island", value: "NF" },
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Norway", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Palau", value: "PW" },
  { label: "Palestinian Territory, Occupied", value: "PS" },
  { label: "Panama", value: "PA" },
  { label: "Papua New Guinea", value: "PG" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Pitcairn", value: "PN" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Qatar", value: "QA" },
  { label: "Reunion", value: "RE" },
  { label: "Romania", value: "RO" },
  { label: "Russian Federation", value: "RU" },
  { label: "RWANDA", value: "RW" },
  { label: "Saint Helena", value: "SH" },
  { label: "Saint Kitts and Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Pierre and Miquelon", value: "PM" },
  { label: "Saint Vincent and the Grenadines", value: "VC" },
  { label: "Samoa", value: "WS" },
  { label: "San Marino", value: "SM" },
  { label: "Sao Tome and Principe", value: "ST" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia and Montenegro", value: "CS" },
  { label: "Seychelles", value: "SC" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Singapore", value: "SG" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Solomon Islands", value: "SB" },
  { label: "Somalia", value: "SO" },
  { label: "South Africa", value: "ZA" },
  { label: "South Georgia and the South Sandwich Islands", value: "GS" },
  { label: "Spain", value: "ES" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Sudan", value: "SD" },
  { label: "Surilabel", value: "SR" },
  { label: "Svalbard and Jan Mayen", value: "SJ" },
  { label: "Swaziland", value: "SZ" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Syrian Arab Republic", value: "SY" },
  { label: "Taiwan, Province of China", value: "TW" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Tanzania, United Republic of", value: "TZ" },
  { label: "Thailand", value: "TH" },
  { label: "Timor-Leste", value: "TL" },
  { label: "Togo", value: "TG" },
  { label: "Tokelau", value: "TK" },
  { label: "Tonga", value: "TO" },
  { label: "Trinidad and Tobago", value: "TT" },
  { label: "Tunisia", value: "TN" },
  { label: "Turkey", value: "TR" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Turks and Caicos Islands", value: "TC" },
  { label: "Tuvalu", value: "TV" },
  { label: "Uganda", value: "UG" },
  { label: "Ukraine", value: "UA" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "United States Minor Outlying Islands", value: "UM" },
  { label: "Uruguay", value: "UY" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Vanuatu", value: "VU" },
  { label: "Venezuela", value: "VE" },
  { label: "Viet Nam", value: "VN" },
  { label: "Virgin Islands, British", value: "VG" },
  { label: "Virgin Islands, U.S.", value: "VI" },
  { label: "Wallis and Futuna", value: "WF" },
  { label: "Western Sahara", value: "EH" },
  { label: "Yemen", value: "YE" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" },
];
