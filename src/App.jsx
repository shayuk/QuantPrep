import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, Settings, Play, Edit, Plus, Image as ImageIcon, X, Trash2, Database, Search, Save, ArrowRight, AlertTriangle, Sparkles, Loader2, Lightbulb, Key, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';

// --- INITIAL DATA BANK ---
const INITIAL_QUESTION_BANK = [
    // --- EXISTING QUESTIONS (ORIGINAL BANK) ---
    {
        id: 101, topic: 'General', difficulty: 'Easy',
        text: 'חוקרת רוצה לשמור את תוצאות הניתוחים הסטטיסטיים בלבד (טבלאות וגרפים), כך שגם אם הנתונים ישתנו, התוצאות יישארו. באיזה קובץ עליה להשתמש?',
        options: ['Output (.spv)', 'Data (.sav)', 'Syntax (.sps)', 'קובץ Data חדש'],
        correct: 0,
        output: null
    },
    {
        id: 102, topic: 'General', difficulty: 'Medium',
        text: 'במשתנה "הכנסה" הוזן ערך ריק לתצפית אחת, וערך 999 לתצפית אחרת (שהוגדר כ-Missing Value). כיצד SPSS יתייחס אליהם?',
        options: ['שניהם Missing, אך הריק הוא System Missing וה-999 הוא User Missing', 'רק 999 הוא Missing', 'הערך הריק יהפוך ל-0', 'SPSS לא מבדיל ביניהם'],
        correct: 0,
        output: null
    },
    {
        id: 103, topic: 'General', difficulty: 'Easy',
        text: 'סטודנט רוצה לחשב ממוצע של שלושה משתנים (X1, X2, X3) וליצור משתנה חדש. באיזו פקודה יש להשתמש?',
        options: ['Compute', 'Recode', 'Select Cases', 'Split File'],
        correct: 0,
        output: null
    },
    {
        id: 104, topic: 'General', difficulty: 'Medium',
        text: 'מה ההבדל העקרוני בין פקודות בתפריט Transform לבין פקודות בתפריט Analyze?',
        options: ['Transform יוצר/משנה משתנים, Analyze מפיק תוצאות סטטיסטיות', 'Transform משנה זמנית, Analyze לצמיתות', 'Transform לכמותיים בלבד', 'Analyze ניתן להרצה פעם אחת בלבד'],
        correct: 0,
        output: null
    },
    {
        id: 105, topic: 'General', difficulty: 'Hard',
        text: 'חוקר רוצה לחשב ממוצע רק עבור נבדקים ששכרם נמוך מ-12,000. מה הדרך הנכונה?',
        options: ['שימוש ב-Compute עם תנאי IF (salary < 12000)', 'חישוב לכולם ואז Select Cases', 'הגדרת השכר הגבוה כ-Missing', 'Descriptives עם סינון זמני'],
        correct: 0,
        output: null
    },
    {
        id: 201, topic: 'Descriptive', difficulty: 'Medium',
        text: 'על סמך הפלט המוצג: מהו אחוז האנשים שלמדו יותר מ-15 שנות לימוד? (התייחס ל-Valid Percent)',
        options: ['30.6%', '74.6%', '25.4%', '69.4%'],
        correct: 0,
        output: {
            type: 'table',
            title: 'שנות לימוד (Years of Education)',
            headers: ['Value', 'Frequency', 'Percent', 'Valid Percent', 'Cumulative Percent'],
            rows: [
                ['...','...','...','...','...'],
                ['15', '146', '5.2', '5.2', '74.6'],
                ['16', '412', '14.5', '14.6', '89.2'],
                ['17', '86', '3.0', '3.0', '92.2'],
                ['18', '109', '3.8', '3.9', '96.1'],
                ['19', '41', '1.4', '1.5', '97.6'],
                ['20', '69', '2.4', '2.4', '100.0'],
                ['Total', '2820', '99.6', '100.0', '']
            ]
        }
    },
    {
        id: 202, topic: 'Descriptive', difficulty: 'Medium',
        text: 'בפלט להלן, עבור קטגוריה 12 שנות לימוד: Percent=30.0 ו-Valid Percent=30.2. מה הסיבה להבדל?',
        options: ['Valid Percent מחושב מתוך המקרים התקפים בלבד (ללא Missing)', 'Percent מתעלם מערכים חסרים', 'מדובר בטעות עיגול', 'Valid Percent רלוונטי רק לנומינלי'],
        correct: 0,
        output: {
            type: 'table',
            title: 'שנות לימוד',
            headers: ['Value', 'Frequency', 'Percent', 'Valid Percent'],
            rows: [
                ['12', '851', '30.0', '30.2'],
                ['Missing', '12', '0.4', '']
            ]
        }
    },
    {
        id: 301, topic: 'Reliability', difficulty: 'Hard',
        text: 'לפניך פלט מהימנות. האלפא קרונבך היא 0.168. מהו הצעד הראשון לשיפור המהימנות?',
        options: ['לבחון את ה-Corrected Item-Total Correlation ולחפש ערכים שליליים (היפוך סקאלה)', 'להגדיל את המדגם', 'למחוק את כל ההיגדים', 'לשנות ל-Ordinal'],
        correct: 0,
        output: {
            type: 'table',
            title: 'Item-Total Statistics',
            headers: ['Item', 'Scale Mean if Deleted', 'Corrected Item-Total Correlation', 'Cronbach\'s Alpha if Deleted'],
            rows: [
                ['wb1', '68.88', '-.031', '.184'],
                ['wb2', '67.69', '-.069', '.210'],
                ['wb3', '66.60', '.016', '.176'],
                ['wb11', '67.83', '-.069', '.210']
            ]
        }
    },
    {
        id: 302, topic: 'Reliability', difficulty: 'Medium',
        text: 'בפלט הבא, איזו פעולה מומלצת לשיפור המהימנות (Alpha=.539)?',
        options: ['להסיר או להפוך את פריט 2 (אם הוא הפוך)', 'להסיר את פריט 7', 'להסיר את פריט 4', 'לא לשנות דבר'],
        correct: 0,
        output: {
            type: 'table',
            title: 'Item-Total Statistics (Alpha = .539)',
            headers: ['Item', 'Corrected Item-Total Correlation', 'Cronbach\'s Alpha if Item Deleted'],
            rows: [
                ['פריט 1', '.194', '.668'],
                ['פריט 2', '.697', '.150'],
                ['פריט 3', '.683', '.310'],
                ['פריט 7', '.034', '.715']
            ]
        }
    },
    {
        id: 401, topic: 'T-Tests', difficulty: 'Medium',
        text: 'חוקרת בודקת הבדלים בשכר בין גברים לנשים (מדגמים בלתי תלויים). בפלט Levene, הערך Sig הוא 0.000. על איזו שורה בטבלה יש להסתכל?',
        options: ['Equal variances not assumed (שורה תחתונה)', 'Equal variances assumed (שורה עליונה)', 'שתיהן נכונות', 'אין חשיבות ל-Levene במדגם גדול'],
        correct: 0,
        output: {
            type: 'table',
            title: 'Independent Samples Test',
            headers: ['Var', 'Levene Sig', 't', 'df', 'Sig (2-tailed)'],
            rows: [
                ['Equal variances assumed', '.000', '8.290', '138', '.000'],
                ['Equal variances not assumed', '', '8.460', '119.6', '.000']
            ]
        }
    },
    {
        id: 402, topic: 'T-Tests', difficulty: 'Easy',
        text: 'במבחן t למדגמים מזווגים (השוואת שכר אב מול שכר אם לאותו נבדק), התקבל Sig=0.014 במתאם, ו-Sig=0.000 במבחן ה-t. מה המסקנה?',
        options: ['יש הבדל מובהק בין השכר של האב לשכר האם', 'יש קשר אך אין הבדל', 'אין הבדל מובהק', 'המבחן לא תקף'],
        correct: 0,
        output: {
            type: 'table',
            title: 'Paired Samples Test',
            headers: ['Pair', 'Mean Diff', 't', 'df', 'Sig. (2-tailed)'],
            rows: [
                ['Father - Mother', '33907.69', '-8.232', '90', '.000']
            ]
        }
    },
    {
        id: 501, topic: 'Chi-Square', difficulty: 'Medium',
        text: 'לפניך פלט Crosstabs (מגדר * מחלקה). הערה בתחתית הטבלה מציינת: "3 cells (30.0%) have expected count less than 5". האם ניתן להסתמך על מבחן חי-בריבוע של פירסון?',
        options: ['לא, ההנחה הופרה (יותר מ-20% מהתאים עם שכיחות צפויה נמוכה)', 'כן, כי המדגם גדול מ-30', 'כן, כי ה-Sig הוא 0.000', 'תלוי במדד קרמר'],
        correct: 0,
        output: {
            type: 'table',
            title: 'Chi-Square Tests',
            headers: ['Test', 'Value', 'df', 'Asymp. Sig. (2-sided)'],
            rows: [
                ['Pearson Chi-Square', '27.114 a', '4', '.000'],
                ['Likelihood Ratio', '32.011', '4', '.000']
            ]
        }
    },
    {
        id: 502, topic: 'Chi-Square', difficulty: 'Easy',
        text: 'מהו המבחן הסטטיסטי המתאים לבדיקת קשר בין "מקום בילוי מועדף" (נומינלי) לבין "מגדר" (נומינלי)?',
        options: ['Chi-Square (חי בריבוע) לאי-תלות', 'Pearson Correlation', 'T-Test', 'Regression'],
        correct: 0,
        output: null
    },
    {
        id: 601, topic: 'Regression', difficulty: 'Hard',
        text: 'ברגרסיה לינארית, המודל כולו מובהק, ה-R בריבוע גבוה, אך לאף משתנה בלתי תלוי אין מובהקות סטטיסטית בטבלת המקדמים. מה הבעיה הסבירה?',
        options: ['מולטיקולינריות (Multicollinearity) גבוהה', 'גודל מדגם קטן מדי', 'התפלגות לא נורמלית של השגיאות', 'הטרוסקדסטיות'],
        correct: 0,
        output: null
    },
    {
        id: 602, topic: 'Regression', difficulty: 'Medium',
        text: 'בפלט הרגרסיה הבא, מהי משוואת הרגרסיה לניבוי המשתנה התלוי?',
        options: ['y = 3.101 + 0.052x', 'y = 0.052 + 3.101x', 'y = 3.101 - 0.052x', 'y = 0.054x'],
        correct: 0,
        output: {
            type: 'table',
            title: 'Coefficients',
            headers: ['Model', 'Unstandardized B', 'Std. Error', 'Beta', 'Sig.'],
            rows: [
                ['(Constant)', '3.101', '.107', '', '.000'],
                ['הכנסה', '.052', '.016', '.051', '.001']
            ]
        }
    },
    {
        id: 603, topic: 'Correlation', difficulty: 'Easy',
        text: 'נמצא מתאם פירסון r=0.78 בין שעות לימוד לציון. מה המסקנה?',
        options: ['קשר חזק וחיובי', 'קשר חלש', 'אין קשר מובהק', 'קשר שלילי חזק'],
        correct: 0,
        output: null
    },

    // --- NEW QUESTIONS FROM FILE (מועד מיוחד תשפ"ה) ---
    {
        id: 1001, topic: 'General', difficulty: 'Medium',
        text: 'מה נכון לומר לגבי פקודת RECODE INTO DIFFERENT VARIABLES בSPSS?',
        options: [
            'פקודה זו יוצרת משתנה חדש שבו ערכי המשתנה המקורי מקודדים מחדש או מקובצים לקטגוריות חדשות, בלי לשנות את המשתנה המקורי',
            'פקודה זו מחשבת ממוצע של כמה משתנים לתוך משתנה חדש ואז מקבצת אותם לקטגוריה חדשה מבלי לשנות את המשתנה המקורי',
            'פקודה זו משנה רק את שם המשתנה בלי לשנות את ערכיו',
            'פקודה זו ממירה אוטומטית את כל הערכים החסרים לערך הממוצע במשתנה'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1002, topic: 'General', difficulty: 'Medium',
        text: 'מרצה רוצה לבדוק האם קיים קשר בין שעות גלישה ברשתות חברתיות (social_time) לבין רמת לחץ (stress) בקרב נשים בלבד. מהי שרשרת הפקודות המתאימה ביותר בSPSS?',
        options: [
            'קודם להשתמש בSELECT CASES כדי לבחור מהמגדר רק נשים, ולאחר מכן להשתמש בCORRELATE BIVARIATE PEARSON ולהכניס את המשתנים social_time וstress',
            'קודם להשתמש בCORRELATE BIVARIATE PEARSON על כל הסטודנטים, ולאחר מכן להשתמש בSPLIT FILE לפי משתנה המגדר',
            'ראשית להשתמש בSPLIT FILE לפי משתנה המגדר, ולאחר מכן בCORRELATE BIVARIATE SPEARMAN על המשתנים social_time וstress',
            'ראשית להשתמש בCOMPUTE ובIF כדי לבחור נשים בלבד, ולאחר מכן בFREQUENCIES על המשתנה stress'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1003, topic: 'General', difficulty: 'Easy',
        text: 'חוקרת גילתה שבחלק מהמקרים התשובה של הנבדק היא "מסרב לענות" בשאלת "כמה שנות לימוד יש לך". כיצד נכון לטפל בערכים אלה בתוכנת SPSS לפני ביצוע ניתוחים?',
        options: [
            'בVariable View, בעמודת Missing, להגדיר ערך מספרי מסוים (למשל 99) כערך חסר עבור המשתנה',
            'בData View, למחוק לגמרי את כל השורה של הנבדקים שבהם יש ערך חסר בשנות לימוד',
            'בVariable View, לשנות את Measure של המשתנה לNominal כך שהערכים החסרים יתעלמו אוטומטית',
            'בData View, להחליף את כל הערכים החסרים בערך 0 במקום להשאיר אותם ריקים'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1004, topic: 'General', difficulty: 'Hard',
        text: 'מהו התיאור המתאים לרצף הפקודות הבא (משמאל לימין) בSPSS? Transform >> RECODE work_hours (0 thru 19=1) (20 thru 60=2) INTO work_cat',
        options: [
            'קידוד מחדש של work_hours לתוך משתנה חדש work_cat שבו שתי קטגוריות: עד 19 שעות עבודה בשבוע ומ20 עד 60 שעות עבודה בשבוע',
            'קידוד מחדש של work_cat לתוך work_hours כך שהערכים 1 ו2 מומרות לשעות עבודה ממשיות',
            'יצירת ממוצע של מספר שעות העבודה בשלושה שבועות שונים לתוך המשתנה work_cat',
            'מחיקת כל הערכים של work_hours עבור מי שעובד פחות מ20 שעות בשבוע'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1005, topic: 'General', difficulty: 'Hard',
        text: 'מרצה רוצה ליצור משתנה חדש בשם FINAL_SCORE שמייצג את ממוצע שלושת המבחנים TEST1, TEST2 וTEST3, אבל רק לסטודנטים בשנה א\' (year=1). מהי דרך העבודה הנכונה בSPSS?',
        options: [
            'להשתמש בCOMPUTE יחד עם IF, למשל : IF (year=1) FINAL_SCORE=MEAN (TEST1,TEST2,TEST3)',
            'להשתמש בRECODE INTO DIFFERENT VARIABLES על שלושת המבחנים כך שFINAL_SCORE יהיה סכום הציונים של כל הסטודנטים',
            'קודם לבצע SELECT CASES לפי year=1, ואז להשתמש בRECODE לתוך FINAL_SCORE כדי לחשב את הממוצע',
            'להריץ FREQUENCIES על שלושת המבחנים ולאחר מכן להשתמש בSPLIT FILE לפי year כדי לקבל את FINAL_SCORE'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1006, topic: 'General', difficulty: 'Hard',
        text: 'מנהל משאבי אנוש רוצה לתת בונוס רק ל10% העובדים שקיבלו את ציוני ההערכה הגבוהים ביותר במשתנה evaluation. לאחר שימצא את ציון הסף, הוא רוצה לחשב שכר חדש הכולל את הבונוס רק לעובדים אלו. מהי שרשרת הפקודות המתאימה ביותר?',
        options: [
            'קודם להריץ FREQUENCIES על evaluation כדי למצוא את הציון שמעליו נמצאים 10% מהעובדים (Percentile 90), ולאחר מכן להשתמש בCOMPUTE יחד עם IF כדי לחשב שכר חדש רק למי שעבר את ציון הסף',
            'קודם להשתמש בSELECT CASES כדי לבחור את 10% העובדים הראשונים בקובץ, ולאחר מכן בCOMPUTE כדי לחשב שכר חדש',
            'קודם להשתמש בCOMPUTE כדי לחשב את Percentile 10, ולאחר מכן בFREQUENCIES כדי להוסיף את הבונוס לעובדים הרלוונטיים',
            'קודם להריץ FREQUENCIES על evaluation כדי למצוא את הממוצע, ולאחר מכן בRECODE INTO SAME VARIABLES כדי להעלות את ערך השכר ב10% לכל העובדים'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1007, topic: 'Reliability', difficulty: 'Medium',
        text: 'על פי הפלט מהי הסיבה הסבירה ביותר לערך הנמוך במיוחד של מקדם המהימנות הכללי?',
        options: [
            'בחלק מהפריטים הניסוח הפוך, והם לא קודדו מחדש כך שכיוונם יהיה זהה לשאר הפריטים',
            'מספר הפריטים בשאלון קטן מדי ולכן לא ניתן לחשב אלפא קרונבאך תקף',
            'הציון של היגד wb10 מאוד נמוך ולכן מקדם המהימנות קטן בהכרח',
            'מספר הנבדקים שנכללו בחישוב קטן מ30 ולכן אלפא קרונבאך תמיד יהיה נמוך'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Reliability Statistics',
            headers: ['Cronbach\'s Alpha', 'N of Items'],
            rows: [['.146', '12']]
        }
    },
    {
        id: 1008, topic: 'Reliability', difficulty: 'Easy',
        text: 'על פי הפלט, מה נכון לגבי מבנה השאלון והמדגם שנבדק?',
        options: [
            'השאלון כולל 12 פריטים, ו68 נבדקים נכללו בחישוב מקדם המהימנות',
            'השאלון כולל 10 פריטים, ו120 נבדקים נכללו בחישוב מקדם המהימנות',
            'השאלון כולל 12 פריטים, וכל 120 המשתתפים נכללו בחישוב מקדם המהימנות',
            'השאלון כולל 68 פריטים, ו12 נבדקים בלבד נכללו בחישוב מקדם המהימנות'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Case Processing Summary',
            headers: ['Cases', 'N', '%'],
            rows: [
                ['Valid', '68', '56.7'],
                ['Excluded', '52', '43.3'],
                ['Total', '120', '100.0']
            ]
        }
    },
    {
        id: 1009, topic: 'Descriptive', difficulty: 'Easy',
        text: 'על פי הפלט, מהי רמת ההשכלה השכיחה ביותר במדגם (במונחי Valid Percent)?',
        options: [
            'תואר ראשון',
            'תיכון',
            'תעודה',
            'דוקטורט'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'רמת השכלה',
            headers: ['Value', 'Frequency', 'Percent', 'Valid Percent'],
            rows: [
                ['יסודי', '1', '3.3', '3.3'],
                ['תיכון', '9', '30.0', '30.0'],
                ['תעודה', '5', '16.7', '16.7'],
                ['תואר ראשון', '11', '36.7', '36.7'],
                ['תואר שני', '2', '6.7', '6.7'],
                ['דוקטורט', '2', '6.7', '6.7'],
                ['Total', '30', '100.0', '100.0']
            ]
        }
    },
    {
        id: 1010, topic: 'Descriptive', difficulty: 'Medium',
        text: 'על פי הפלט, איזה מן המשפטים הבאים נכון לגבי משתנה "שכר חודשי ברוטו (ש"ח)"?',
        options: [
            'כ25% מהמשיבים מדווחים על שכר חודשי שאינו עולה על 10,149 ₪',
            'כ75% מהמשיבים מרוויחים לפחות 13,551.88 ₪ בחודש',
            'השכר החציוני במדגם הוא 10,149 ₪',
            'סטיית התקן של השכר היא 14.623 ₪'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Statistics - שכר חודשי ברוטו',
            headers: ['Statistic', 'Value'],
            rows: [
                ['N Valid', '115'],
                ['Mean', '11412.63'],
                ['Median', '11463.50'],
                ['Std. Deviation', '1668.87'],
                ['Percentile 25', '10149.00'],
                ['Percentile 50', '11463.50'],
                ['Percentile 75', '12524.00']
            ]
        }
    },
    {
        id: 1011, topic: 'Descriptive', difficulty: 'Hard',
        text: 'מה ניתן להסיק מה השוואה בין הממוצע לבין החציון של השכר החודשי ברוטו בפלט?',
        options: [
            'הממוצע והחציון כמעט זהים, ולכן התפלגות השכר עשויה להיות סימטרית, ללא זנב קיצוני בולט',
            'החציון נמוך בהרבה מהממוצע ולכן התפלגות השכר מוטה שמאלה בצורה קיצונית',
            'אי אפשר להסיק דבר על ההתפלגות, משום שלא ניתנו נתונים על השכר השכיח או סטיית התקן.',
            'ההבדל בין ממוצע לחציון מעיד שהתפלגות השכר היא נומינלית בלבד'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Statistics Summary',
            headers: ['Statistic', 'Value'],
            rows: [
                ['Mean', '11412.63'],
                ['Median', '11463.50']
            ]
        }
    },
    {
        id: 1012, topic: 'Correlation', difficulty: 'Medium',
        text: 'על פי הפלט, איזה מן המשפטים הבאים נכון?',
        options: [
            'קיים קשר חיובי מובהק ובעוצמה בינונית בין שעות שינה בלילה לבין שביעות רצון מהקורס',
            'קיים קשר שלילי מובהק בעוצמה חלשה בין ציונך במבחן האחרון לבין שביעות רצון מהקורס',
            'לא קיים קשר מובהק בין השכלה לבין שביעות רצון מהקורס',
            'קיים קשר שלילי מובהק בעוצמה חלשה בין ההכנסה החודשית המשוערת לבין רמת ההשכלה'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Correlations (Partial View)',
            headers: ['Pair', 'Pearson Correlation', 'Sig. (2-tailed)', 'N'],
            rows: [
                ['שעות שינה - שביעות רצון', '.478*', '.009', '28'],
                ['ציון במבחן - שביעות רצון', '.278*', '.047', '26'],
                ['השכלה - שביעות רצון', '-.118', '.533', '30'],
                ['הכנסה - השכלה', '.401**', '.003', '28']
            ]
        }
    },
    {
        id: 1013, topic: 'Correlation', difficulty: 'Hard',
        text: 'על פי הפלט, מהו הדיווח המספרי המתאים לבדיקת ההשערה: "ימצא קשר בין שעות שינה בלילה לבין שביעות רצון מהקורס"?',
        options: [
            'r(28)=.48, p<.01',
            'r(30)=.209, p>.05',
            'r(28)=.47, p<.05',
            'r(30)=.009, p<.01'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1014, topic: 'Correlation', difficulty: 'Medium',
        text: 'על פי הפלט, מה נכון לגבי הקשרים בין "ציונך במבחן האחרון" לבין שאר המשתנים?',
        options: [
            'נמצא קשר חיובי מובהק בעוצמה בינונית בין ההכנסה החודשית המשוערת לבין רמת ההשכלה.',
            'לא נמצא קשר מובהק בין הציון במבחן האחרון לבין אף אחד מהמשתנים האחרים לפי מתאם פירסון',
            'נמצא קשר שלילי מובהק בין הציון במבחן לבין מספר האחים/האחיות',
            'נמצא קשר חיובי מובהק חזק בין הציון במבחן לבין רמת ההשכלה'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1015, topic: 'Regression', difficulty: 'Medium',
        text: 'על סמך פלט 4, מה ניתן להסיק לגבי מודל הרגרסיה?',
        options: [
            'ממוצע תמיכת המנהל בעבודה מנבא באופן מובהק את ממוצע תחושת הרווחה בעבודה, אך מסביר רק 16% מהשונות',
            'מודל הרגרסיה הכולל את תמיכת המנהל אינו מובהק סטטיסטית כלל',
            'ממוצע תחושת הרווחה בעבודה מנבא את תמיכת המנהל בעבודה, והמודל מסביר כמעט 40% מכל השונות',
            'המודל מסביר מעל 70% מהשונות בתחושת הרווחה ולכן אין צורך בבדיקת מובהקות'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Model Summary & ANOVA',
            headers: ['Model', 'R', 'R Square', 'F', 'Sig.'],
            rows: [
                ['1', '.395', '.156', '21.83', '<.001']
            ]
        }
    },
    {
        id: 1016, topic: 'Regression', difficulty: 'Hard',
        text: 'יש להשלים את המשפט הבא על פי פלט 4: המתאם בין ממוצע תמיכת המנהל בעבודה לבין ממוצע תחושת הרווחה בעבודה הוא____ , כך שתמיכת המנהל מסבירה כ______ מן השונות בתחושת הרווחה.',
        options: [
            '0.395 ; 15.6%',
            '0.156 ; 39.5%',
            '0.672 ; 45.2%',
            '0.452 ; 67%'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1017, topic: 'Regression', difficulty: 'Hard',
        text: 'כיצד נכון לדווח על בדיקת המובהקות של מודל הרגרסיה בפלט 4?',
        options: [
            'F(1,118)=21.83, p<.001',
            'F(118,1)=21.83, p<.05',
            'F(1,119)=21.83, p>.05',
            'F(2,118)=21.83, p<.01'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'ANOVA',
            headers: ['Model', 'df', 'F', 'Sig.'],
            rows: [
                ['Regression', '1', '21.83', '<.001'],
                ['Residual', '118', '', ''],
                ['Total', '119', '', '']
            ]
        }
    },
    {
        id: 1018, topic: 'Correlation', difficulty: 'Easy',
        text: 'בהנחה שהגרף בפלט 5 מציג נקודות המתפזרות סביב קו ליניארי ברור (והמתאם בין המשתנים נמצא מובהק), מה ניתן להסיק לגביו?',
        options: [
            'קיים קשר חיובי: ככל שהערך של המשתנה בציר הX גבוה יותר, כך נוטה גם הערך של המשתנה בציר הY להיות גבוה יותר',
            'קיים קשר שלילי: ככל שהערך של המשתנה בציר הX גבוה יותר, כך הערך של המשתנה בציר הY נוטה להיות נמוך יותר',
            'לא ניתן להסיק דבר על כיוון הקשר מתוך תרשים פיזור, אלא רק על בסיס טבלת מתאם',
            'הקשר בין המשתנים הוא נומינלי בלבד ולכן לא צפוי דפוס כלשהו בתרשים הפיזור'
        ],
        correct: 0,
        output: {
            type: 'text',
            title: 'תיאור גרף פיזור (Scatter Plot)',
            text: 'הגרף מציג ענן נקודות עם מגמה עולה משמאל לימין.'
        }
    },
    {
        id: 1019, topic: 'Correlation', difficulty: 'Medium',
        text: 'מה ניתן לומר על הקשר בין המשתנים מתוך הגרף בפלט 5?',
        options: [
            'קיים קשר חיובי בעוצמה בינונית',
            'לא קיים קשר בין המשתנים',
            'קיים קשר שלילי בעוצמה בינונית',
            'אי אפשר לזהות רמת ועוצמת קשר בתרשים פיזור אלא רק באמצעות טבלת χ²'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1020, topic: 'Chi-Square', difficulty: 'Medium',
        text: 'מה נכון לומר לגבי תנאי השימוש במבחן χ² על פי פלט 6?',
        options: [
            'למעלה מ20% מן התאים בעלי שכיחות צפויה נמוכה מ5, ולכן תנאי המבחן אינם מתקיימים',
            'כל התאים עומדים בתנאי שכיחות צפויה של לפחות 5, ולכן המבחן תקף לחלוטין',
            'יש תא אחד בלבד שבו השכיחות הצפויה היא אפס, ולכן התוכנה לא חישבה את סטטיסטי הχ²',
            'מספר המקרים הכולל גדול מ200 ולכן התנאים למבחן χ² תמיד מתקיימים באופן אוטומטי'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Chi-Square Tests Footnote',
            headers: ['Note'],
            rows: [
                ['a. 4 cells (66.7%) have expected count less than 5. The minimum expected count is 2.50.']
            ]
        }
    },
    {
        id: 1021, topic: 'Chi-Square', difficulty: 'Medium',
        text: 'על סמך טבלת התצפיות בפלט 6, איזה מן המשפטים הבאים נכון?',
        options: [
            'מבין בעלי השכלה תיכונית, 73.3% אינם מעשנים כרגע',
            'מבין בעלי השכלה אקדמית, 73.3% מעשנים כיום',
            'מבין אלו שדיווחו שהם לשעבר מעשנים, 66.7% הם בעלי השכלה תיכונית',
            '16.7% מהמשתתפים בעלי השכלה תיכונית ואינם מעשנים'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'השכלה * האם אתה מעשן Crosstabulation',
            headers: ['השכלה', 'כן', 'לא', 'לשעבר', 'Total'],
            rows: [
                ['תיכונית - Count', '2', '11', '2', '15'],
                ['תיכונית - % within השכלה', '13.3%', '73.3%', '13.3%', '100%']
            ]
        }
    },
    {
        id: 1022, topic: 'Chi-Square', difficulty: 'Hard',
        text: 'כיצד נכון לדווח כמקובל על תוצאת מבחן χ² בפלט 6 (מבלי להתייחס לבעיית השכיחויות הצפויות)?',
        options: [
            'χ²(2)=0.60, p<.05',
            'χ²(2)=0.54, p<.05',
            'χ²(28)=0.60, p<.05',
            'χ²(3)=2.50, p<.05'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Chi-Square Tests',
            headers: ['Test', 'Value', 'df', 'Asymp. Sig. (2-sided)'],
            rows: [
                ['Pearson Chi-Square', '.600', '2', '.041'],
                ['Likelihood Ratio', '.603', '2', '.040'],
                ['N of Valid Cases', '28', '', '']
            ]
        }
    },
    {
        id: 1023, topic: 'T-Tests', difficulty: 'Medium',
        text: 'בפלט 7, מהו המשתנה הבלתי תלוי ומהו המשתנה התלוי?',
        options: [
            'משתנה בלתי תלוי: זמן המדידה (לפני שבץ מוחי, אחרי שבץ מוחי); משתנה תלוי: רמת הדיכאון',
            'משתנה בלתי תלוי: רמת הדיכאון; משתנה תלוי: זמן המדידה (לפני שבץ מוחי, אחרי שבץ מוחי)',
            'משתנה בלתי תלוי: רמת הדיכאון לאחר שבץ; משתנה תלוי: רמת הדיכאון לפני שבץ',
            'משתנה בלתי תלוי: מספר הנבדקים; משתנה תלוי: זמן המדידה'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Paired Samples Test Context',
            headers: ['Pair 1'],
            rows: [
                ['רמת דיכאון לפני שבץ מוחי - רמת דיכאון לאחר שבץ מוחי']
            ]
        }
    },
    {
        id: 1024, topic: 'T-Tests', difficulty: 'Medium',
        text: 'מהי המסקנה הנכונה מפלט 7 לגבי השינוי ברמת הדיכאון?',
        options: [
            'רמת הדיכאון לאחר שבץ מוחי גבוהה באופן מובהק מרמת הדיכאון לפני שבץ מוחי',
            'רמת הדיכאון לפני שבץ מוחי גבוהה באופן מובהק מרמת הדיכאון לאחר שבץ מוחי',
            'לא נמצא הבדל מובהק ברמת הדיכאון בין שתי המדידות',
            'נמצא הבדל מובהק אך לא ניתן לדעת מאיזה כיוון הוא, כי הt שלילי'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Paired Samples Statistics & Test',
            headers: ['Stat', 'Before', 'After', 'Sig.'],
            rows: [
                ['Mean', '.01', '.34', '<.001'],
                ['t', '-6.687', '', '']
            ]
        }
    },
    {
        id: 1025, topic: 'T-Tests', difficulty: 'Medium',
        text: 'על סמך פלט 8, עבור איזה מזון לא נמצא הבדל מובהק בצריכה בין גברים לנשים (בהשערה דוכיוונית)?',
        options: [
            'טוסט עם ריבה',
            'קפה ועוגה',
            'טוסט עם חמאה',
            'בכל שלושת המזונות נמצא הבדל מובהק בין גברים לנשים'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Independent Samples Test',
            headers: ['Food', 'Sig. (2-tailed)'],
            rows: [
                ['טוסט עם ריבה', '.967'],
                ['קפה ועוגה', '.018'],
                ['טוסט עם חמאה', '.048']
            ]
        }
    },
    {
        id: 1026, topic: 'T-Tests', difficulty: 'Hard',
        text: 'על פי פלט 8, מה נכון לגבי צריכת "טוסט עם חמאה"?',
        options: [
            'נשים אוכלות בממוצע יותר טוסט עם חמאה מגברים, וההבדל ביניהם מובהק ברמת p<.05',
            'גברים אוכלים בממוצע יותר טוסט עם חמאה מנשים, וההבדל ביניהם מובהק ברמת p<.05',
            'נשים אוכלות בממוצע יותר טוסט עם חמאה מגברים, אך ההבדל ביניהם אינו מובהק סטטיסטית',
            'אין שום מידע בפלט לגבי כיוון ההבדל בצריכת טוסט עם חמאה בין גברים לנשים'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Group Statistics (Toast with Butter)',
            headers: ['Gender', 'Mean'],
            rows: [
                ['גברים', '6.57'],
                ['נשים', '9.29']
            ]
        }
    },
    {
        id: 1027, topic: 'T-Tests', difficulty: 'Hard',
        text: 'בפלט 8 כיצד נכון לדווח על תוצאת המבחן עבור קפה ועוגה?',
        options: [
            't(34.16)=2.48, p<.05',
            't(40)=2.48, p<.01',
            't(34.16)=2.48, p>.05',
            't(21)=2.48, p<.05'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Independent Samples Test (Coffee & Cake)',
            headers: ['Assumption', 'Levene Sig', 't', 'df', 'Sig (2-tailed)'],
            rows: [
                ['Equal variances assumed', '.013', '2.477', '40', '.018'],
                ['Equal variances not assumed', '', '2.477', '34.164', '.018']
            ]
        }
    },
    {
        id: 1028, topic: 'T-Tests', difficulty: 'Easy', 
        text: 'בפלט 9 (ANOVA), מהו המשתנה הבלתי תלוי ומהו המשתנה התלוי?',
        options: [
            'משתנה בלתי תלוי: קטגוריית הרכב; משתנה תלוי: שביעות רצון בעבודה',
            'משתנה בלתי תלוי: שביעות רצון בעבודה; משתנה תלוי: קטגוריית מחיר הרכב',
            'משתנה בלתי תלוי: שביעות רצון בעבודה; משתנה תלוי: הממוצע הכללי במדגם',
            'משתנה בלתי תלוי: מינימום ומקסימום הציון; משתנה תלוי: קטגוריית הרכב'
        ],
        correct: 0,
        output: null
    },
    {
        id: 1029, topic: 'T-Tests', difficulty: 'Medium',
        text: 'כיצד נכון לדווח על תוצאת הANOVA בפלט 9?',
        options: [
            'F(2,2205)=75.71, p<.001',
            'F(2205,2)=75.71, p<.05',
            'F(2,2207)=75.71, p>.05',
            'F(3,2205)=75.71, p<.01'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'ANOVA',
            headers: ['Source', 'df', 'F', 'Sig.'],
            rows: [
                ['Between Groups', '2', '75.71', '<.001'],
                ['Within Groups', '2205', '', ''],
                ['Total', '2207', '', '']
            ]
        }
    },
    {
        id: 1030, topic: 'T-Tests', difficulty: 'Hard',
        text: 'מה נכון לגבי ההבדלים בשביעות רצון בעבודה בין קבוצות קטגורית הרכב על פי פלט 9?',
        options: [
            'שביעות הרצון של בעלי רכב אקונומי נמוכה באופן מובהק משל בעלי רכב סטנדרטי ומרכב יוקרה, ואין הבדל מובהק בין רכב סטנדרטי לרכב יוקרה',
            'שביעות הרצון של בעלי רכב יוקרה נמוכה באופן מובהק משל בעלי רכב אקונומי, אך שווה לזו של בעלי רכב סטנדרטי',
            'קיימים הבדלים מובהקים בין כל שלוש הקבוצות: אקונומי, סטנדרטי ויוקרה',
            'לא נמצאו הבדלים מובהקים כלל, ולכן אין משמעות למבחן Scheffé'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Multiple Comparisons (Scheffe)',
            headers: ['(I) Category', '(J) Category', 'Mean Diff', 'Sig.'],
            rows: [
                ['אקונומי', 'סטנדרטי', '-.667*', '<.001'],
                ['אקונומי', 'יוקרה', '-.870*', '<.001'],
                ['סטנדרטי', 'יוקרה', '-.203', '.177']
            ]
        }
    },
    {
        id: 1031, topic: 'Regression', difficulty: 'Medium',
        text: 'על פי פלט 10, מה נכון לגבי מודל הרגרסיה המרובה לניבוי דימוי הגוף?',
        options: [
            'המודל מובהק ברמת p<.001 ומסביר כ24.3% מן השונות בדימוי הגוף',
            'המודל אינו מובהק כלל, אף שמקדם המתאם R גבוה',
            'המודל מסביר כמעט את כל השונות בדימוי הגוף (מעל 80%) ולכן אין צורך במשתני ניבוי נוספים',
            'המודל מובהק רק ברמת p<.05 ומסביר פחות מ5% מן השונות בדימוי הגוף'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Model Summary & ANOVA',
            headers: ['R Square', 'F', 'Sig.'],
            rows: [
                ['.243', '22.773', '<.001']
            ]
        }
    },
    {
        id: 1032, topic: 'Regression', difficulty: 'Medium',
        text: 'מה ניתן להסיק מפלט 10 לגבי מולטיקוליניאריות בין המנבאים?',
        options: [
            'אין בעיית מולטיקולינאריות משמעותית, כיוון שכל ערכי הVIF קרובים ל1 ונמוכים מ2',
            'קיימת מולטיקולינאריות חמורה, כיוון שכל ערכי הVIF גבוהים מ10',
            'קיימת מולטיקולינאריות חמורה בין כל שלושת המשתנים, כיוון שכל ערכי הTolerance הם 0',
            'לא ניתן להסיק דבר לגבי מולטיקולינאריות משום שאין בטבלה ערכי VIF או Tolerance'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Coefficients - Collinearity Statistics',
            headers: ['Model', 'Tolerance', 'VIF'],
            rows: [
                ['משטר אכילה', '.661', '1.512'],
                ['מצב נפשי', '.702', '1.424'],
                ['קשרי משפחה', '.814', '1.229']
            ]
        }
    },
    {
        id: 1033, topic: 'Regression', difficulty: 'Medium',
        text: 'על סמך טבלת המקדמים בפלט 10, איזה מן המשתנים המנבאים הוא החזק ביותר בניבוי דימוי הגוף?',
        options: [
            'קשרי משפחה',
            'מצב נפשי (נטייה למצבי רוח משתנים)',
            'משטר אכילה קפדני (נטייה לצום)',
            'שלושת המשתנים בעלי אותו משקל בדיוק ולכן אין מנבא חזק או חלש יותר'
        ],
        correct: 0,
        output: {
            type: 'table',
            title: 'Coefficients (Standardized)',
            headers: ['Model', 'Beta'],
            rows: [
                ['משטר אכילה', '.151'],
                ['מצב נפשי', '.197'],
                ['קשרי משפחה', '.280']
            ]
        }
    }
];

// --- HELPER FUNCTIONS ---

const callGemini = async (prompt, apiKey) => {
    if (!apiKey) return null;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};

// Helper to shuffle options and update correct index
const shuffleOptions = (question) => {
    const optionsWithStatus = question.options.map((opt, i) => ({ 
        text: opt, 
        isCorrect: i === question.correct 
    }));
    
    for (let i = optionsWithStatus.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithStatus[i], optionsWithStatus[j]] = [optionsWithStatus[j], optionsWithStatus[i]];
    }
    
    const newOptions = optionsWithStatus.map(o => o.text);
    const newCorrectIndex = optionsWithStatus.findIndex(o => o.isCorrect);

    return {
        ...question,
        options: newOptions,
        correct: newCorrectIndex
    };
};

// --- COMPONENTS ---

// 1. Toast Notification Component
function Notification({ message, type, onClose }) {
    if (!message) return null;
    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-down ${type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
            {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="mr-2 hover:opacity-75"><X className="w-4 h-4" /></button>
        </div>
    );
}

// 2. Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center animate-scale-in" dir="rtl">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">מחיקת שאלה</h3>
                <p className="text-gray-600 mb-6">האם אתה בטוח שברצונך למחוק שאלה זו מהמאגר לצמיתות? פעולה זו אינה הפיכה.</p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition">מחק</button>
                    <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300 transition">ביטול</button>
                </div>
            </div>
        </div>
    );
}

function SPSSOutput({ data }) {
    if (!data) return null;
    
    if (data.type === 'text') {
        return (
            <div className="my-4 border p-4 bg-white shadow-sm text-center">
                <div className="font-bold text-base mb-2 text-gray-800">{data.title}</div>
                <p className="text-gray-700">{data.text}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto my-4 border p-2 bg-white shadow-sm" dir="ltr">
            <div className="font-bold text-base mb-2 text-center text-gray-800">{data.title}</div>
            <table className="w-full border-collapse border border-black text-sm text-center bg-white">
                <thead>
                    <tr className="border-t-2 border-b-2 border-black bg-gray-100">
                        {data.headers.map((h, i) => (
                            <th key={i} className="border border-gray-300 p-2 font-bold text-gray-800">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row, rIndex) => (
                        <tr key={rIndex} className="hover:bg-gray-50">
                            {row.map((cell, cIndex) => (
                                <td key={cIndex} className="border border-gray-300 p-2">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Add/Edit Question Form Component
function AddQuestionForm({ onSave, onCancel, topics, initialData = null, showNotification, apiKey }) {
    const [formData, setFormData] = useState({
        topic: topics[0] || 'General',
        difficulty: 'Medium',
        text: '',
        options: ['', '', '', ''],
        correct: 0,
        image: null
    });
    const [isNewTopic, setIsNewTopic] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (!topics.includes(initialData.topic)) {
                // Topic handling if needed
            }
        }
    }, [initialData, topics]);

    const handleOptionChange = (idx, value) => {
        const newOptions = [...formData.options];
        newOptions[idx] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateQuestion = async () => {
        if (!apiKey) {
            showNotification("יש להזין מפתח API בהגדרות כדי להשתמש ב-AI", "error");
            return;
        }
        const topicToUse = formData.topic || "SPSS Statistics";
        setIsGenerating(true);
        try {
            const prompt = `Generate a single multiple choice question in Hebrew about SPSS statistics regarding the topic "${topicToUse}".
            Return strictly a JSON object with this structure:
            {
                "text": "The question text in Hebrew",
                "options": ["Option 1 in Hebrew", "Option 2 in Hebrew", "Option 3 in Hebrew", "Option 4 in Hebrew"],
                "correct": 0,
                "difficulty": "Medium"
            }
            Ensure the content is accurate and suitable for university students. Do not include markdown code blocks, just the raw JSON.`;
            
            const result = await callGemini(prompt, apiKey);
            
            if (result) {
                // Remove potential markdown formatting if present
                const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanResult);
                setFormData(prev => ({
                    ...prev,
                    text: parsed.text,
                    options: parsed.options,
                    correct: parsed.correct,
                    difficulty: parsed.difficulty || 'Medium'
                }));
                showNotification("שאלה חוללה בהצלחה!", "success");
            } else {
                showNotification("שגיאה ביצירת השאלה", "error");
            }
        } catch (e) {
            console.error(e);
            showNotification("שגיאה ביצירת השאלה, נסה שנית", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!formData.text || formData.options.some(o => !o) || !formData.topic) {
            showNotification('אנא מלא את כל השדות (נושא, שאלה ו-4 תשובות)', 'error');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in" dir="rtl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {initialData ? 'עריכת שאלה' : 'הוספת שאלה חדשה'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">נושא</label>
                            {!isNewTopic ? (
                                <select 
                                    value={formData.topic} 
                                    onChange={(e) => {
                                        if (e.target.value === '__NEW__') {
                                            setIsNewTopic(true);
                                            setFormData({...formData, topic: ''});
                                        } else {
                                            setFormData({...formData, topic: e.target.value});
                                        }
                                    }}
                                    className="w-full border rounded-lg p-2"
                                >
                                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                                    <option value="__NEW__" className="font-bold text-blue-600 border-t">+ נושא חדש...</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                        placeholder="הזן נושא חדש"
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                    <button 
                                        onClick={() => { setIsNewTopic(false); setFormData({...formData, topic: topics[0] || 'General'}); }}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded-lg text-sm"
                                        title="ביטול"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">רמת קושי</label>
                            <select 
                                value={formData.difficulty} 
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="Easy">קל (Easy)</option>
                                <option value="Medium">בינוני (Medium)</option>
                                <option value="Hard">קשה (Hard)</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative">
                         <div className="flex justify-between items-end mb-1">
                            <label className="block text-sm font-medium text-gray-700">תוכן השאלה</label>
                            <button 
                                onClick={handleGenerateQuestion}
                                disabled={isGenerating}
                                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition flex items-center gap-1 border border-purple-200"
                            >
                                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {isGenerating ? 'מחולל...' : 'צור שאלה אוטומטית עם AI'}
                            </button>
                        </div>
                        <textarea 
                            value={formData.text}
                            onChange={(e) => setFormData({...formData, text: e.target.value})}
                            className="w-full border rounded-lg p-3 min-h-[100px]"
                            placeholder="הקלד את השאלה כאן..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            תמונה / פלט (אופציונלי)
                        </label>
                        <div className="flex items-center gap-4">
                             <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 border">
                                <ImageIcon className="w-5 h-5" />
                                <span>{formData.image ? 'החלף תמונה' : 'העלה תמונה'}</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            {formData.image && (
                                <div className="relative group">
                                    <img src={formData.image} alt="Preview" className="h-20 w-auto border rounded" />
                                    <button 
                                        onClick={() => setFormData({...formData, image: null})}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">תשובות (סמן את הנכונה)</label>
                        {formData.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="correct-answer"
                                    checked={formData.correct === idx}
                                    onChange={() => setFormData({...formData, correct: idx})}
                                    className="w-5 h-5 accent-blue-600"
                                />
                                <input 
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    placeholder={`תשובה ${idx + 1}`}
                                    className={`flex-1 border rounded-lg p-2 ${formData.correct === idx ? 'border-blue-500 bg-blue-50' : ''}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t flex gap-3">
                        <button 
                            onClick={handleSave}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
                        >
                            {initialData ? 'שמור שינויים' : 'הוסף שאלה'}
                        </button>
                        <button 
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300"
                        >
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [step, setStep] = useState('config'); 
    
    // -- LocalStorage Initialization (UPDATED LOGIC) --
    const [questions, setQuestions] = useState(() => {
        // 1. Always start with the updated code-base questions as the source of truth
        let combinedQuestions = [...INITIAL_QUESTION_BANK];

        const savedJSON = localStorage.getItem('statmaster_questions');
        if (savedJSON) {
            try {
                const savedQuestions = JSON.parse(savedJSON);
                
                // 2. Identify custom questions added by the user manually (User generated)
                // We identify them by checking if their ID does NOT exist in the code bank.
                const initialIds = new Set(INITIAL_QUESTION_BANK.map(q => q.id));
                const userCustomQuestions = savedQuestions.filter(q => !initialIds.has(q.id));
                
                // 3. Merge: Code questions + User custom questions
                combinedQuestions = [...combinedQuestions, ...userCustomQuestions];
            } catch (e) {
                console.error("Failed to parse questions from storage", e);
            }
        }
        return combinedQuestions;
    });

    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem('statmaster_apikey') || '';
    });

    const [config, setConfig] = useState({
        topics: { General: 0, Descriptive: 0, Reliability: 0, 'T-Tests': 0, 'Chi-Square': 0, Regression: 0, Correlation: 0 },
        difficulties: { Easy: 0, Medium: 0, Hard: 0 }
    });
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [hints, setHints] = useState({}); 
    const [loadingHintId, setLoadingHintId] = useState(null);
    
    // New States for UI Management
    const [notification, setNotification] = useState(null); 
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

    // -- Effects for Saving to LocalStorage --
    useEffect(() => {
        localStorage.setItem('statmaster_questions', JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        localStorage.setItem('statmaster_apikey', apiKey);
    }, [apiKey]);

    // Helper for notifications
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        if (!window.XLSX) {
            const script = document.createElement('script');
            script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const getCount = (topic, diff) => questions.filter(q => 
        (topic === 'All' || q.topic === topic) && 
        (diff === 'All' || q.difficulty === diff)
    ).length;

    const handleConfigChange = (type, key, val) => {
        const num = parseInt(val);
        if (num < 0) return;
        setConfig(prev => ({
            ...prev,
            [type]: { ...prev[type], [key]: num || 0 }
        }));
    };

    const handleSaveQuestion = (questionData) => {
        if (!config.topics.hasOwnProperty(questionData.topic)) {
            setConfig(prev => ({
                ...prev,
                topics: { ...prev.topics, [questionData.topic]: 0 }
            }));
        }

        if (editingQuestionId) {
            setQuestions(prev => prev.map(q => q.id === editingQuestionId ? { ...questionData, id: editingQuestionId } : q));
            setEditingQuestionId(null);
            showNotification('השאלה עודכנה בהצלחה!');
        } else {
            const newQ = { id: Date.now(), ...questionData };
            setQuestions([...questions, newQ]);
            showNotification('השאלה נוספה בהצלחה למאגר!');
        }
        setShowAddModal(false);
    };

    // Updated Delete Logic with Modal
    const initiateDelete = (id) => {
        setDeleteConfirm({ isOpen: true, id });
    };

    const confirmDelete = () => {
        const id = deleteConfirm.id;
        if (id) {
            setQuestions(prev => prev.filter(q => q.id !== id));
            setSelectedQuestions(prev => prev.filter(q => q.id !== id));
            showNotification('השאלה נמחקה בהצלחה', 'success');
        }
        setDeleteConfirm({ isOpen: false, id: null });
    };

    const resetToDefaults = () => {
        if (window.confirm("האם אתה בטוח שברצונך לאפס את המאגר לברירת המחדל? כל השאלות שנוספו יימחקו.")) {
            setQuestions(INITIAL_QUESTION_BANK);
            showNotification("המאגר אופס בהצלחה");
        }
    };

    const openEditModal = (question) => {
        setEditingQuestionId(question.id);
        setShowAddModal(true);
    };

    const generateQuiz = () => {
        let pool = [];
        Object.entries(config.topics).forEach(([topic, count]) => {
            if (count > 0) {
                const topicQuestions = questions.filter(q => q.topic === topic);
                const shuffled = topicQuestions.sort(() => 0.5 - Math.random());
                // Shuffle options for each selected question
                const selectedWithShuffledOptions = shuffled.slice(0, count).map(q => shuffleOptions(q));
                pool = [...pool, ...selectedWithShuffledOptions];
            }
        });

        if (pool.length === 0) {
            showNotification("נא לבחור לפחות שאלה אחת.", 'error');
            return;
        }
        
        setSelectedQuestions(pool);
        setStep('review');
    };

    const replaceQuestion = (index) => {
        const currentQ = selectedQuestions[index];
        const alternatives = questions.filter(q => 
            q.topic === currentQ.topic && 
            !selectedQuestions.find(sq => sq.id === q.id)
        );
        
        if (alternatives.length > 0) {
            const randomQ = alternatives[Math.floor(Math.random() * alternatives.length)];
            const newQ = shuffleOptions(randomQ); // Shuffle options for the replacement
            const newSelection = [...selectedQuestions];
            newSelection[index] = newQ;
            setSelectedQuestions(newSelection);
        } else {
            showNotification("אין שאלות נוספות זמינות בנושא זה.", 'error');
        }
    };

    const removeQuestion = (index) => {
        const newSelection = [...selectedQuestions];
        newSelection.splice(index, 1);
        setSelectedQuestions(newSelection);
        if (newSelection.length === 0) setStep('config');
    };

    const submitQuiz = () => {
        let correctCount = 0;
        selectedQuestions.forEach(q => {
            if (userAnswers[q.id] === q.correct) correctCount++;
        });
        setScore((correctCount / selectedQuestions.length) * 100);
        setStep('result');
    };

    const downloadExcel = () => {
        if (!window.XLSX) {
            showNotification("רכיב האקסל עדיין נטען, אנא נסה שוב בעוד רגע.", 'error');
            return;
        }

        const data = selectedQuestions.map((q, i) => ({
            'מספר שאלה': i + 1,
            'נושא': q.topic,
            'קושי': q.difficulty,
            'שאלה': q.text,
            'תשובה משתמש': q.options[userAnswers[q.id]] || 'לא נענה',
            'תשובה נכונה': q.options[q.correct],
            'תוצאה': userAnswers[q.id] === q.correct ? 'נכון' : 'שגוי'
        }));
        
        data.push({ 'שאלה': 'ציון סופי', 'תוצאה': score.toFixed(2) });

        const ws = window.XLSX.utils.json_to_sheet(data);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "תוצאות מבחן");
        window.XLSX.writeFile(wb, "SPSS_Quiz_Results.xlsx");
    };
    
    const getHint = async (question) => {
        if (!apiKey) {
            showNotification("יש להזין מפתח API בהגדרות כדי לקבל רמזים", "error");
            return;
        }
        setLoadingHintId(question.id);
        const prompt = `The student is answering this SPSS multiple choice question in Hebrew:
        Question: "${question.text}"
        Options: ${question.options.join(', ')}
        
        Provide a helpful hint in Hebrew that guides them to the right concept without explicitly stating the answer or the correct option number. Keep it short (1-2 sentences).`;

        const hint = await callGemini(prompt, apiKey);
        setHints(prev => ({ ...prev, [question.id]: hint || "לא ניתן היה לייצר רמז כרגע." }));
        setLoadingHintId(null);
    };


    // --- RENDER STEPS ---

    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans" dir="rtl">
            
            {/* Notifications and Modals */}
            <Notification 
                message={notification?.message} 
                type={notification?.type} 
                onClose={() => setNotification(null)} 
            />
            
            <DeleteConfirmModal 
                isOpen={deleteConfirm.isOpen}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
            />

            {showAddModal && (
                <AddQuestionForm 
                    onSave={handleSaveQuestion} 
                    onCancel={() => { setShowAddModal(false); setEditingQuestionId(null); }}
                    topics={Object.keys(config.topics)}
                    initialData={editingQuestionId ? questions.find(q => q.id === editingQuestionId) : null}
                    showNotification={showNotification}
                    apiKey={apiKey}
                />
            )}

            {step === 'config' && (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-200 animate-fade-in-up">
                    <div className="flex flex-col items-center mb-6">
                        <Settings className="w-12 h-12 text-blue-600 mb-2" />
                        <h1 className="text-3xl font-bold text-blue-800">StatMaster AI</h1>
                        <p className="text-gray-500 mt-2">מחולל מבחני SPSS וסטטיסטיקה</p>
                    </div>

                    {/* API Key Input Section */}
                    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold">
                            <Key className="w-4 h-4" />
                            <span>הגדרת מפתח AI (Gemini API)</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="password" 
                                placeholder="הדבק כאן את מפתח ה-API שלך..." 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="flex-1 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <p className="text-xs text-purple-600 mt-2">
                            * המפתח נדרש ליצירת שאלות אוטומטית ולקבלת רמזים חכמים. הוא נשמר בדפדפן שלך בלבד.
                        </p>
                    </div>
                    
                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={() => { setEditingQuestionId(null); setShowAddModal(true); }}
                            className="flex-1 bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-bold hover:bg-green-100 transition flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> הוסף שאלה
                        </button>
                        <button 
                            onClick={() => setStep('manage')}
                            className="flex-1 bg-gray-100 text-gray-700 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                        >
                            <Database className="w-5 h-5" /> ניהול מאגר שאלות
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg border">
                        {Object.keys(config.topics).map(topic => {
                            const available = getCount(topic, 'All');
                            return (
                                <div key={topic} className="flex justify-between items-center p-3 bg-white border rounded shadow-sm hover:shadow-md transition">
                                    <span className="font-semibold text-gray-700">{topic}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">זמין: {available}</span>
                                        <input 
                                            type="number" min="0" max={available}
                                            className="w-20 border rounded-md p-2 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={config.topics[topic]}
                                            onChange={(e) => handleConfigChange('topics', topic, e.target.value)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={generateQuiz}
                        className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                    >
                        <Play className="w-6 h-6" /> צור מבחן
                    </button>
                </div>
            )}

            {step === 'manage' && (
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-200 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Database className="text-blue-600" /> ניהול מאגר השאלות
                        </h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={resetToDefaults}
                                className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full hover:bg-orange-200 transition flex items-center gap-1"
                                title="אפס את המאגר לברירת המחדל"
                            >
                                <RotateCcw className="w-3 h-3" /> איפוס מלא
                            </button>
                            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                                סה"כ: {questions.length}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                        <input 
                            type="text"
                            placeholder="חפש שאלה לפי טקסט או נושא..."
                            className="w-full border rounded-xl py-3 pr-10 pl-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {questions.filter(q => q.text.includes(searchTerm) || q.topic.includes(searchTerm)).map((q) => (
                            <div key={q.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start bg-gray-50 hover:bg-white transition hover:shadow-md gap-4">
                                <div className="flex-1">
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{q.topic}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${q.difficulty === 'Hard' ? 'text-red-600 bg-red-50' : q.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'}`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-gray-800 font-medium">{q.text}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button 
                                        onClick={() => openEditModal(q)} 
                                        className="text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition flex items-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" /> ערוך
                                    </button>
                                    <button 
                                        onClick={() => initiateDelete(q.id)} 
                                        className="text-sm bg-red-100 text-red-800 px-3 py-2 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" /> מחק
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={() => setStep('config')}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition flex items-center gap-2"
                        >
                            חזור להגדרות <ArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                    </div>
                </div>
            )}

            {step === 'review' && (
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-200 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Edit className="text-blue-600" /> סקירת המבחן
                        </h2>
                        <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                            {selectedQuestions.length} שאלות נבחרו
                        </span>
                    </div>
                    
                    <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedQuestions.map((q, idx) => (
                            <div key={idx} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start bg-gray-50 hover:bg-white transition hover:shadow-md gap-4">
                                <div className="flex-1">
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{q.topic}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${q.difficulty === 'Hard' ? 'text-red-600 bg-red-50' : q.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'}`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-gray-800 font-medium">{q.text}</p>
                                    {q.image && (
                                        <div className="mt-2">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <ImageIcon className="w-3 h-3" /> כולל תמונה
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => replaceQuestion(idx)} className="text-sm bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-200 transition flex items-center gap-1">
                                        <RefreshCw className="w-4 h-4" /> החלף
                                    </button>
                                    <button onClick={() => removeQuestion(idx)} className="text-sm bg-red-100 text-red-800 px-3 py-2 rounded-lg hover:bg-red-200 transition flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> הסר
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4">
                        <button onClick={() => setStep('config')} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
                            חזור להגדרות
                        </button>
                        {selectedQuestions.length > 0 && 
                            <button onClick={() => setStep('quiz')} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
                                התחל מבחן
                            </button>
                        }
                    </div>
                </div>
            )}

            {step === 'quiz' && (
                <div className="max-w-4xl mx-auto mt-6 animate-fade-in-up">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 sticky top-4 z-10">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-gray-800">מבחן SPSS</h2>
                            <span className="text-sm font-semibold text-blue-600">
                                {Object.keys(userAnswers).length} / {selectedQuestions.length} נענו
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(Object.keys(userAnswers).length / selectedQuestions.length) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="space-y-8 pb-20">
                        {selectedQuestions.map((q, idx) => (
                            <div key={q.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold text-lg text-blue-900 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-full border border-blue-100">
                                        {idx + 1}
                                    </span>
                                    <div className="flex gap-2">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border flex items-center">{q.topic}</span>
                                        <button 
                                            onClick={() => getHint(q)} 
                                            disabled={loadingHintId === q.id}
                                            className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition flex items-center gap-1 border border-amber-200"
                                        >
                                            {loadingHintId === q.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
                                            {loadingHintId === q.id ? 'טוען רמז...' : 'קבל רמז'}
                                        </button>
                                    </div>
                                </div>
                                
                                <p className="mb-6 text-gray-800 font-medium text-lg leading-relaxed">{q.text}</p>
                                
                                {q.output && (
                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <SPSSOutput data={q.output} />
                                    </div>
                                )}

                                {q.image && (
                                    <div className="mb-6 border rounded-lg p-2 bg-gray-50 inline-block">
                                        <img src={q.image} alt="Question Data" className="max-w-full h-auto rounded" />
                                    </div>
                                )}

                                {hints[q.id] && (
                                    <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm animate-fade-in-down flex gap-2">
                                        <Sparkles className="w-4 h-4 shrink-0 mt-1" />
                                        <div>
                                            <div className="font-bold mb-1">רמז חכם (AI):</div>
                                            {hints[q.id]}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="space-y-3">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = userAnswers[q.id] === optIdx;
                                        return (
                                            <label key={optIdx} className={`flex items-center cursor-pointer group p-4 border rounded-lg transition-all ${isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50 border-gray-200'}`}>
                                                <input 
                                                    type="radio" 
                                                    name={`q-${q.id}`} 
                                                    className="hidden"
                                                    onChange={() => setUserAnswers(prev => ({...prev, [q.id]: optIdx}))}
                                                    checked={isSelected}
                                                />
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 shrink-0 ml-3 ${isSelected ? 'border-blue-600' : 'border-gray-400'}`}>
                                                    {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                                                </div>
                                                <span className="text-gray-700">{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
                        <div className="max-w-4xl mx-auto">
                            <button 
                                onClick={submitQuiz}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 shadow-lg transition flex items-center justify-center gap-2"
                            >
                                <CheckCircle /> הגש מבחן
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 'result' && (
                <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center animate-fade-in-up" dir="rtl">
                    <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-2xl text-center border border-gray-200">
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${score >= 60 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {score >= 60 ? <CheckCircle className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-2 text-gray-800">תוצאות המבחן</h2>
                        <p className="text-gray-500 mb-6">סיכום הביצועים שלך</p>
                        
                        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                            <div className="text-sm text-gray-500 uppercase tracking-wide font-bold">ציון סופי</div>
                            <div className={`text-6xl font-extrabold my-2 ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                                {score.toFixed(0)}
                            </div>
                            <div className="text-gray-600 font-medium">
                                ענית נכון על {Object.keys(userAnswers).filter(qid => userAnswers[qid] === selectedQuestions.find(q => q.id == qid).correct).length} 
                                מתוך {selectedQuestions.length} שאלות
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={downloadExcel}
                                className="bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <Download className="w-5 h-5" /> הורד דוח תוצאות לאקסל
                            </button>
                            <button 
                                onClick={() => { setStep('config'); setUserAnswers({}); setScore(0); setSelectedQuestions([]); }}
                                className="bg-white text-gray-700 border border-gray-300 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> התחל מבחן חדש
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translate(-50%, -20px); }
                    100% { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    0% { opacity: 0; transform: scale(0.9); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
}
