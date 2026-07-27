"""
Rewrite metadata.json with clean displayTitle and description values.
The existing 'title' is kept for SEO <title> tags but also cleaned up.
A new 'displayTitle' field provides a clean, readable <h1> heading.
"""
import json
import os

METADATA_PATH = os.path.join(os.path.dirname(__file__), "..", "content", "metadata.json")

# ── Clean metadata definitions ──
# Format: slug -> { displayTitle, title (SEO), description }
CLEAN_METADATA = {
    # ── Homepage ──
    "/": {
        "displayTitle": "PUC Notes & Solutions",
        "title": "PUC Notes & Solutions — Karnataka 10th, 1st & 2nd PUC Study Resources",
        "description": "Free study resources for Karnataka state board students — download notes, textbooks, model papers, solved papers and question banks for KSEEB 10th, DPUE 1st PUC and 2nd PUC."
    },

    # ── Static pages ──
    "menu": {
        "displayTitle": "Browse All Resources",
        "title": "All Resources — KSEEB 10th & DPUE 1st & 2nd PUC | PUC Notes",
        "description": "Navigate through all available study materials for Karnataka 10th standard, 1st PUC and 2nd PUC — notes, textbooks, question papers and more."
    },
    "contact": {
        "displayTitle": "Contact Us",
        "title": "Contact Us | PUC Notes & Solutions",
        "description": "Have a question or found an error? Get in touch with the PUC Notes & Solutions team."
    },
    "about": {
        "displayTitle": "About Us",
        "title": "About | PUC Notes & Solutions",
        "description": "Learn about PUC Notes & Solutions — our mission to provide free, high-quality study resources for Karnataka state board students."
    },
    "privacy-policy": {
        "displayTitle": "Privacy Policy",
        "title": "Privacy Policy | PUC Notes & Solutions",
        "description": "Read our privacy policy to understand how we handle your data."
    },
    "terms-conditions": {
        "displayTitle": "Terms & Conditions",
        "title": "Terms & Conditions | PUC Notes & Solutions",
        "description": "Review the terms and conditions for using PUC Notes & Solutions."
    },
    "content-updates": {
        "displayTitle": "Content Updates",
        "title": "Content Updates | PUC Notes & Solutions",
        "description": "Check the latest content updates and new additions to PUC Notes & Solutions."
    },

    # ── Class-level pages ──
    "10thkseebresources": {
        "displayTitle": "10th Standard — KSEEB Resources",
        "title": "KSEEB 10th Standard — Textbooks, Model Papers & Resources | PUC Notes",
        "description": "Download textbooks, model papers, solved papers and previous year papers for Karnataka 10th standard (SSLC) KSEEB board."
    },
    "1stpuckarnataka": {
        "displayTitle": "1st PUC — Karnataka DPUE",
        "title": "1st PUC Karnataka — Science & Commerce Study Resources | PUC Notes",
        "description": "Access textbooks, notes, model papers, previous year papers and question banks for 1st PUC Karnataka DPUE — Science and Commerce streams."
    },
    "2ndpuckarnataka": {
        "displayTitle": "2nd PUC — Karnataka DPUE",
        "title": "2nd PUC Karnataka — Science & Commerce Study Resources | PUC Notes",
        "description": "Access textbooks, notes, model papers, previous year papers and question banks for 2nd PUC Karnataka DPUE — Science and Commerce streams."
    },

    # ── Stream-level pages (1st PUC) ──
    "1st-puc-science-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC Science Stream",
        "title": "1st PUC Science — Notes, Papers & Question Banks | PUC Notes",
        "description": "Study resources for Karnataka 1st PUC Science stream — Physics, Chemistry, Mathematics, Biology, Computer Science and Electronics."
    },
    "1st-puc-science-pcmb-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC — PCMB",
        "title": "1st PUC PCMB — Physics, Chemistry, Maths & Biology | PUC Notes",
        "description": "Study materials for 1st PUC PCMB combination — Physics, Chemistry, Mathematics and Biology resources for Karnataka DPUE."
    },
    "1st-puc-science-pcmc-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC — PCMC",
        "title": "1st PUC PCMC — Physics, Chemistry, Maths & Computer Science | PUC Notes",
        "description": "Study materials for 1st PUC PCMC combination — Physics, Chemistry, Mathematics and Computer Science resources for Karnataka DPUE."
    },
    "1st-puc-science-pcme-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC — PCME",
        "title": "1st PUC PCME — Physics, Chemistry, Maths & Electronics | PUC Notes",
        "description": "Study materials for 1st PUC PCME combination — Physics, Chemistry, Mathematics and Electronics resources for Karnataka DPUE."
    },
    "1st-puc-commerce-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC Commerce Stream",
        "title": "1st PUC Commerce — Notes, Papers & Question Banks | PUC Notes",
        "description": "Study resources for Karnataka 1st PUC Commerce stream — Accountancy, Business Studies, Economics, Statistics and more."
    },
    "1st-puc-commerce-seba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC — SEBA",
        "title": "1st PUC SEBA — Statistics, Economics, Business Studies & Accountancy | PUC Notes",
        "description": "Study materials for 1st PUC SEBA combination — Statistics, Economics, Business Studies and Accountancy resources for Karnataka DPUE."
    },
    "1st-puc-commerce-heba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC — HEBA",
        "title": "1st PUC HEBA — History, Economics, Business Studies & Accountancy | PUC Notes",
        "description": "Study materials for 1st PUC HEBA combination — History, Economics, Business Studies and Accountancy resources for Karnataka DPUE."
    },
    "1st-puc-commerce-ceba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "1st PUC — CEBA",
        "title": "1st PUC CEBA — Computer Science, Economics, Business Studies & Accountancy | PUC Notes",
        "description": "Study materials for 1st PUC CEBA combination — Computer Science, Economics, Business Studies and Accountancy resources for Karnataka DPUE."
    },
    "1st-puc-languages-hindi-english-kannada-notes-model-question-solved-papers-download-pdf": {
        "displayTitle": "1st PUC Languages",
        "title": "1st PUC Languages — Kannada, Hindi & English Resources | PUC Notes",
        "description": "Study resources for Karnataka 1st PUC languages — Kannada, Hindi and English notes, model papers, previous year papers and question banks."
    },

    # ── Stream-level pages (2nd PUC) ──
    "2nd-puc-science-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC Science Stream",
        "title": "2nd PUC Science — Notes, Papers & Question Banks | PUC Notes",
        "description": "Study resources for Karnataka 2nd PUC Science stream — Physics, Chemistry, Mathematics, Biology, Computer Science and Electronics."
    },
    "2nd-puc-science-pcmb-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC — PCMB",
        "title": "2nd PUC PCMB — Physics, Chemistry, Maths & Biology | PUC Notes",
        "description": "Study materials for 2nd PUC PCMB combination — Physics, Chemistry, Mathematics and Biology resources for Karnataka DPUE."
    },
    "2nd-puc-science-pcmc-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC — PCMC",
        "title": "2nd PUC PCMC — Physics, Chemistry, Maths & Computer Science | PUC Notes",
        "description": "Study materials for 2nd PUC PCMC combination — Physics, Chemistry, Mathematics and Computer Science resources for Karnataka DPUE."
    },
    "2nd-puc-science-pcme-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC — PCME",
        "title": "2nd PUC PCME — Physics, Chemistry, Maths & Electronics | PUC Notes",
        "description": "Study materials for 2nd PUC PCME combination — Physics, Chemistry, Mathematics and Electronics resources for Karnataka DPUE."
    },
    "2nd-puc-commerce-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC Commerce Stream",
        "title": "2nd PUC Commerce — Notes, Papers & Question Banks | PUC Notes",
        "description": "Study resources for Karnataka 2nd PUC Commerce stream — Accountancy, Business Studies, Economics, Statistics and more."
    },
    "2nd-puc-commerce-seba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC — SEBA",
        "title": "2nd PUC SEBA — Statistics, Economics, Business Studies & Accountancy | PUC Notes",
        "description": "Study materials for 2nd PUC SEBA combination — Statistics, Economics, Business Studies and Accountancy resources for Karnataka DPUE."
    },
    "2nd-puc-commerce-heba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC — HEBA",
        "title": "2nd PUC HEBA — History, Economics, Business Studies & Accountancy | PUC Notes",
        "description": "Study materials for 2nd PUC HEBA combination — History, Economics, Business Studies and Accountancy resources for Karnataka DPUE."
    },
    "2nd-puc-commerce-ceba-notes-model-papers-question-papers-questionbank-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC — CEBA",
        "title": "2nd PUC CEBA — Computer Science, Economics, Business Studies & Accountancy | PUC Notes",
        "description": "Study materials for 2nd PUC CEBA combination — Computer Science, Economics, Business Studies and Accountancy resources for Karnataka DPUE."
    },
    "2nd-puc-languages-hindi-english-kannada-notes-model-question-solved-papers-download-pdf": {
        "displayTitle": "2nd PUC Languages",
        "title": "2nd PUC Languages — Kannada, Hindi & English Resources | PUC Notes",
        "description": "Study resources for Karnataka 2nd PUC languages — Kannada, Hindi and English notes, model papers, previous year papers and question banks."
    },

    # ── Subject papers pages (1st PUC) ──
    "1st-puc-physics": {
        "displayTitle": "1st PUC Physics",
        "title": "1st PUC Physics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Physics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-chemistry": {
        "displayTitle": "1st PUC Chemistry",
        "title": "1st PUC Chemistry — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Chemistry model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-mathematics": {
        "displayTitle": "1st PUC Mathematics",
        "title": "1st PUC Mathematics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Mathematics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-biology": {
        "displayTitle": "1st PUC Biology",
        "title": "1st PUC Biology — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Biology model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-computer-science": {
        "displayTitle": "1st PUC Computer Science",
        "title": "1st PUC Computer Science — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Computer Science model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-electronics": {
        "displayTitle": "1st PUC Electronics",
        "title": "1st PUC Electronics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Electronics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-accountancy-content": {
        "displayTitle": "1st PUC Accountancy",
        "title": "1st PUC Accountancy — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Accountancy model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-economic": {
        "displayTitle": "1st PUC Economics",
        "title": "1st PUC Economics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Economics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-business-studies": {
        "displayTitle": "1st PUC Business Studies",
        "title": "1st PUC Business Studies — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Business Studies model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-statistics": {
        "displayTitle": "1st PUC Statistics",
        "title": "1st PUC Statistics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Statistics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-history": {
        "displayTitle": "1st PUC History",
        "title": "1st PUC History — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC History model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-kannada": {
        "displayTitle": "1st PUC Kannada",
        "title": "1st PUC Kannada — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Kannada model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-hindi": {
        "displayTitle": "1st PUC Hindi",
        "title": "1st PUC Hindi — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC Hindi model papers with solutions, previous year papers, solved papers and question banks."
    },
    "1st-puc-english": {
        "displayTitle": "1st PUC English",
        "title": "1st PUC English — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 1st PUC English model papers with solutions, previous year papers, solved papers and question banks."
    },

    # ── Subject papers pages (2nd PUC) ──
    "2nd-puc-computer-science": {
        "displayTitle": "2nd PUC Computer Science",
        "title": "2nd PUC Computer Science — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Computer Science model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-chemistry": {
        "displayTitle": "2nd PUC Chemistry",
        "title": "2nd PUC Chemistry — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Chemistry model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-mathematics": {
        "displayTitle": "2nd PUC Mathematics",
        "title": "2nd PUC Mathematics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Mathematics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-biology": {
        "displayTitle": "2nd PUC Biology",
        "title": "2nd PUC Biology — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Biology model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-electronics": {
        "displayTitle": "2nd PUC Electronics",
        "title": "2nd PUC Electronics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Electronics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-accountancy": {
        "displayTitle": "2nd PUC Accountancy",
        "title": "2nd PUC Accountancy — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Accountancy model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-economics": {
        "displayTitle": "2nd PUC Economics",
        "title": "2nd PUC Economics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Economics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-business-studies": {
        "displayTitle": "2nd PUC Business Studies",
        "title": "2nd PUC Business Studies — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Business Studies model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-statistics": {
        "displayTitle": "2nd PUC Statistics",
        "title": "2nd PUC Statistics — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Statistics model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-history": {
        "displayTitle": "2nd PUC History",
        "title": "2nd PUC History — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC History model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-kannada": {
        "displayTitle": "2nd PUC Kannada",
        "title": "2nd PUC Kannada — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Kannada model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-hindi": {
        "displayTitle": "2nd PUC Hindi",
        "title": "2nd PUC Hindi — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC Hindi model papers with solutions, previous year papers, solved papers and question banks."
    },
    "2nd-puc-english": {
        "displayTitle": "2nd PUC English",
        "title": "2nd PUC English — Model Papers, Previous Year Papers & Question Bank | PUC Notes",
        "description": "Download 2nd PUC English model papers with solutions, previous year papers, solved papers and question banks."
    },

    # ── Notes pages (1st PUC) ──
    "1st-pu-notes-physics": {
        "displayTitle": "1st PUC Physics — Chapter Notes",
        "title": "1st PUC Physics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Physics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-chemistry": {
        "displayTitle": "1st PUC Chemistry — Chapter Notes",
        "title": "1st PUC Chemistry Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Chemistry notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-mathematics": {
        "displayTitle": "1st PUC Mathematics — Chapter Notes",
        "title": "1st PUC Mathematics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Mathematics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-biology": {
        "displayTitle": "1st PUC Biology — Chapter Notes",
        "title": "1st PUC Biology Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Biology notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-computer-science": {
        "displayTitle": "1st PUC Computer Science — Chapter Notes",
        "title": "1st PUC Computer Science Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Computer Science notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-electronics": {
        "displayTitle": "1st PUC Electronics — Chapter Notes",
        "title": "1st PUC Electronics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Electronics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-accountancy-notes": {
        "displayTitle": "1st PUC Accountancy — Chapter Notes",
        "title": "1st PUC Accountancy Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Accountancy notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-economics": {
        "displayTitle": "1st PUC Economics — Chapter Notes",
        "title": "1st PUC Economics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Economics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-business-studies": {
        "displayTitle": "1st PUC Business Studies — Chapter Notes",
        "title": "1st PUC Business Studies Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Business Studies notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-statistics": {
        "displayTitle": "1st PUC Statistics — Chapter Notes",
        "title": "1st PUC Statistics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Statistics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-history": {
        "displayTitle": "1st PUC History — Chapter Notes",
        "title": "1st PUC History Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC History notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-kannada": {
        "displayTitle": "1st PUC Kannada — Chapter Notes",
        "title": "1st PUC Kannada Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Kannada notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-hindi": {
        "displayTitle": "1st PUC Hindi — Chapter Notes",
        "title": "1st PUC Hindi Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC Hindi notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "1st-pu-notes-english": {
        "displayTitle": "1st PUC English — Chapter Notes",
        "title": "1st PUC English Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 1st PUC English notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },

    # ── Notes pages (2nd PUC) ──
    "2nd-pu-notes-physics": {
        "displayTitle": "2nd PUC Physics — Chapter Notes",
        "title": "2nd PUC Physics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Physics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-chemistry": {
        "displayTitle": "2nd PUC Chemistry — Chapter Notes",
        "title": "2nd PUC Chemistry Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Chemistry notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-mathematics": {
        "displayTitle": "2nd PUC Mathematics — Chapter Notes",
        "title": "2nd PUC Mathematics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Mathematics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-biology": {
        "displayTitle": "2nd PUC Biology — Chapter Notes",
        "title": "2nd PUC Biology Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Biology notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-computer-science": {
        "displayTitle": "2nd PUC Computer Science — Chapter Notes",
        "title": "2nd PUC Computer Science Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Computer Science notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-electronics": {
        "displayTitle": "2nd PUC Electronics — Chapter Notes",
        "title": "2nd PUC Electronics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Electronics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-accountancy": {
        "displayTitle": "2nd PUC Accountancy — Chapter Notes",
        "title": "2nd PUC Accountancy Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Accountancy notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-economics": {
        "displayTitle": "2nd PUC Economics — Chapter Notes",
        "title": "2nd PUC Economics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Economics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-business-studies": {
        "displayTitle": "2nd PUC Business Studies — Chapter Notes",
        "title": "2nd PUC Business Studies Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Business Studies notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-statistics": {
        "displayTitle": "2nd PUC Statistics — Chapter Notes",
        "title": "2nd PUC Statistics Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Statistics notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-history": {
        "displayTitle": "2nd PUC History — Chapter Notes",
        "title": "2nd PUC History Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC History notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-kannada": {
        "displayTitle": "2nd PUC Kannada — Chapter Notes",
        "title": "2nd PUC Kannada Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Kannada notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-hindi": {
        "displayTitle": "2nd PUC Hindi — Chapter Notes",
        "title": "2nd PUC Hindi Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC Hindi notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },
    "2nd-pu-notes-english": {
        "displayTitle": "2nd PUC English — Chapter Notes",
        "title": "2nd PUC English Notes — Chapter-wise PDF Download | PUC Notes",
        "description": "Download chapter-wise 2nd PUC English notes and revision materials as PDF, aligned to Karnataka DPUE syllabus."
    },

    # ── Resource aggregate pages ──
    "textbooksdownload": {
        "displayTitle": "Textbook Downloads",
        "title": "Karnataka State Board Textbooks — 10th, 1st PUC & 2nd PUC PDF Download | PUC Notes",
        "description": "Download textbooks for Karnataka state board KSEEB 10th standard and DPUE 1st & 2nd PUC."
    },
    "1stpuctextbookdownload": {
        "displayTitle": "1st PUC Textbooks",
        "title": "1st PUC Textbooks — Science & Commerce PDF Download | PUC Notes",
        "description": "Download textbooks for all 1st PUC subjects — Science and Commerce streams, based on DPUE and NCERT syllabus."
    },
    "2ndpuctextbookdownload": {
        "displayTitle": "2nd PUC Textbooks",
        "title": "2nd PUC Textbooks — Science & Commerce PDF Download | PUC Notes",
        "description": "Download textbooks for all 2nd PUC subjects — Science and Commerce streams, based on DPUE and NCERT syllabus."
    },
    "10th-textbookspdfdownload": {
        "displayTitle": "10th Standard Textbooks",
        "title": "KSEEB 10th Standard Textbooks — SSLC PDF Download | PUC Notes",
        "description": "Download 10th standard textbooks from KTBS for Karnataka state board KSEEB — Science, Maths, Social, Hindi, English and Kannada."
    },
    "previous-year-papers": {
        "displayTitle": "Previous Year Papers",
        "title": "Previous Year Papers — 10th, 1st PUC & 2nd PUC | PUC Notes",
        "description": "Download previous year papers for Karnataka 10th standard, 1st PUC and 2nd PUC — all subjects, Science and Commerce streams."
    },
    "model-papers": {
        "displayTitle": "Model Papers",
        "title": "Model Papers — 1st PUC & 2nd PUC | PUC Notes",
        "description": "Download model papers for Karnataka 1st PUC and 2nd PUC — all subjects with solutions."
    },
    "solved-papers": {
        "displayTitle": "Solved Papers",
        "title": "Solved Papers — 1st PUC & 2nd PUC | PUC Notes",
        "description": "Download solved papers with detailed solutions for Karnataka 1st PUC and 2nd PUC — all subjects."
    },
    "question-bank": {
        "displayTitle": "Question Banks",
        "title": "Question Banks — 10th, 1st PUC & 2nd PUC | PUC Notes",
        "description": "Download question banks for Karnataka 10th standard, 1st PUC and 2nd PUC — all subjects."
    },
    "revision-notes": {
        "displayTitle": "Chapter-wise Revision Notes",
        "title": "Chapter-wise Revision Notes — 1st PUC & 2nd PUC | PUC Notes",
        "description": "Download chapter-wise revision notes for Karnataka 1st PUC and 2nd PUC — both Science and Commerce streams."
    },
    "exclusive-short-notes": {
        "displayTitle": "Exclusive Short Notes",
        "title": "Exclusive Short Notes — 1st PUC & 2nd PUC | PUC Notes",
        "description": "Condensed short notes designed to help score 90%+ in Karnataka DPUE board exams — available as free PDF downloads."
    },
    "mid-term-papers": {
        "displayTitle": "Mid-Term Papers",
        "title": "Mid-Term Papers — 1st PUC & 2nd PUC | PUC Notes",
        "description": "Download mid-term papers for Karnataka 1st PUC and 2nd PUC — all subjects, Science and Commerce streams."
    },
    "ncert-textbook-solutions": {
        "displayTitle": "NCERT Textbook Solutions",
        "title": "NCERT Textbook Solutions — 1st PUC & 2nd PUC Chapter-wise | PUC Notes",
        "description": "Download chapter-wise solutions for NCERT textbook problems — Physics, Chemistry and Mathematics."
    },

    # ── KCET pages ──
    "kcet": {
        "displayTitle": "KCET Resources",
        "title": "KCET — Solved Papers, Exam Pattern, Question Bank & Cutoffs | PUC Notes",
        "description": "Everything you need for KCET preparation — previous year papers, solved papers, exam pattern, question banks, cutoffs and revision notes."
    },
    "kcet-solved-papers": {
        "displayTitle": "KCET Solved Papers",
        "title": "KCET Solved Papers with Solutions (2014–2022) | PUC Notes",
        "description": "Download KCET papers from 2014 to 2022 with complete solutions — Physics, Chemistry, Mathematics and Biology."
    },
    "kcet-question-papers": {
        "displayTitle": "KCET Question Papers",
        "title": "KCET Previous Year Question Papers with Key Answers | PUC Notes",
        "description": "Download KCET question papers from 2014 to 2022 with key answers and solutions."
    },
    "kcet-question-bank": {
        "displayTitle": "KCET Question Bank",
        "title": "KCET Question Bank — Vikasana by KEA | PUC Notes",
        "description": "Access the KCET question bank published by KEA (Vikasana) — Physics, Chemistry, Mathematics and Biology."
    },
    "kcet-mock-papers": {
        "displayTitle": "KCET Mock Papers",
        "title": "KCET Mock Papers — Practice Papers PDF Download | PUC Notes",
        "description": "Download KCET mock/practice papers to improve your exam preparation and time management."
    },
    "kcet-pattern": {
        "displayTitle": "KCET Exam Pattern",
        "title": "KCET Exam Pattern & Trend Analysis | PUC Notes",
        "description": "Understand the KCET examination pattern along with trend analysis of previous year papers — Physics, Chemistry, Mathematics and Biology."
    },
    "kcet-cutoffs": {
        "displayTitle": "KCET Cutoffs",
        "title": "KCET Cutoffs — Engineering, Agriculture, Architecture & More | PUC Notes",
        "description": "Check KCET cutoffs for Engineering, Agriculture, Architecture, Pharmacy and Naturopathy across admission rounds (2018–2022)."
    },
    "kcet-latest-news": {
        "displayTitle": "KCET Latest News",
        "title": "KCET Latest News & Updates — Admissions, Results & Dates | PUC Notes",
        "description": "Stay updated on KCET admissions, application deadlines, document verification, results and important dates."
    },
    "kcet-revision-notes": {
        "displayTitle": "KCET Revision Notes",
        "title": "KCET Revision Notes — Physics, Chemistry, Maths & Biology | PUC Notes",
        "description": "Quick revision notes covering all KCET topics — Physics, Chemistry, Mathematics and Biology available as free PDF downloads."
    },
}


def main():
    # Load existing metadata
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    updated = 0
    added_display = 0

    for slug, clean in CLEAN_METADATA.items():
        if slug in metadata:
            metadata[slug]["title"] = clean["title"]
            metadata[slug]["description"] = clean["description"]
            metadata[slug]["displayTitle"] = clean["displayTitle"]
            updated += 1
        else:
            metadata[slug] = clean
            added_display += 1

    # For any remaining entries not in CLEAN_METADATA, 
    # auto-generate a displayTitle from the existing title
    for slug, entry in metadata.items():
        if "displayTitle" not in entry:
            # Try to extract a clean name from the title
            title = entry.get("title", slug)
            # Strip common suffixes
            for suffix in [
                " | PUC Notes & Solutions",
                " | PUC Notes",
                " | Pucnotes Solutions",
                " | Pucnotes&Solutions",
                "-PUCnotes&solutions",
                " PUCnotes&solutions",
            ]:
                if title.endswith(suffix):
                    title = title[: -len(suffix)]
            # Take only the part before | or - if it's a reasonable length
            if "|" in title:
                parts = title.split("|")
                title = parts[0].strip()
            entry["displayTitle"] = title
            added_display += 1

    # Write back
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"[OK] Updated {updated} entries with clean titles & descriptions")
    print(f"[OK] Added displayTitle to {added_display} entries")
    print(f"[OK] Total entries: {len(metadata)}")


if __name__ == "__main__":
    main()
