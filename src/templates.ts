import type { MovieStyle, MovieLength, AudioLanguage } from './types';

export interface IdeaTemplate {
  id: string;
  prompt: string;
  style: MovieStyle;
  movieLength: MovieLength;
  characterDescription: string;
  selectedLanguages: AudioLanguage[];
  beCreative: boolean;
}

export const TEMPLATES: Record<string, IdeaTemplate> = {
  children: {
    id: 'children',
    prompt: `בבית עץ קסום שצומח על ענפי אלון עתיק, חיים שלושה ילדים: מיקה — ילדה בת 7 עם שיער מתולתל אדום וחולצת פסים ירוקה, דני — ילד בת 8 עם עור כהה ושיער מקורזל וחולצה כתומה, ולילי — ילדה בת 6 עם צמות בלונדיניות ושמלה סגולה עם כוכבים.

יום אחד, הם מוצאים ספר סיפורים עתיק שזוהר באור זהוב. כשמיקה פותחת את הספר, דרקון ירוק קטן וידידותי בשם זומזום עף החוצה מהעמודים. לזומזום יש כנפיים קטנות, עיניים גדולות וחייכניות, וקשקשים בצבע אמרלד.

זומזום מוביל את הילדים דרך שער קסום שנפתח בתוך הספר. הם עוברים לעולם מלא בפרפרים זוהרים, עצים שמדברים, ונהר של שוקולד. בדרך הם פוגשים ינשוף חכם שנותן להם חידה.

הילדים פותרים את החידה ביחד, וגשר קשת מופיע ומוביל אותם לטירה של ענן. בטירה הם מוצאים כתר זוהר — כשלילי שמה אותו על הראש, כל הדמויות מהספר מתעוררות לחיים ועולם הספר נשמר לנצח.

הם חוזרים לבית העץ, מחבקים את זומזום, וסוגרים את הספר. אבל בלילה, כשהם ישנים, זומזום מציץ מהספר ומחייך.`,
    style: 'Pixar',
    movieLength: 'medium',
    characterDescription: 'Three children: Mika — 7-year-old girl with curly red hair, green striped shirt, bright green eyes, freckles. Danny — 8-year-old boy with dark brown skin, short curly black hair, orange t-shirt, warm brown eyes. Lily — 6-year-old girl with blonde twin braids, purple dress with silver stars, big blue eyes. Zumzum the dragon — small emerald-green dragon, tiny wings, huge friendly golden eyes, round belly, always smiling.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  documentary: {
    id: 'documentary',
    prompt: `לפני 66 מיליון שנה, ביער גשם טרופי צפוף ולח בעולם הפרהיסטורי, ביצה גדולה מונחת בין שרכים ענקיים. הביצה מתחילה להיסדק.

ראפטור תינוק קטן דוחף את ראשו הרטוב מבעד לקליפה השבורה. עיניו הגדולות נפתחות לראשונה ורואות את העולם — יער ענק עם עצי מחט גבוהים כמו מגדלים, שרכים בגובה אדם, ואדים עולים מהקרקע הלחה.

הראפטור הקטן מתנדנד על רגליו הרעועות ועושה את צעדיו הראשונים. הוא שומע קול — אמו, ראפטור ענקית עם נוצות צבעוניות בגווני ירוק וכחול, קוראת לו מעבר לשרכים.

הוא הולך אחרי הקול ומגיע לנקודת תצפית על צוק. מתחתיו נפרש עמק ירוק אינסופי. בעמק רועים סטגוזאורים ענקיים, פטרוזאורים עפים בשמיים, וטריצרטופסים שותים מנהר רחב.

לפתע רעידת אדמה. העצים רועדים. בקצה האופק, הר געש מתפרץ — לבה אדומה זורמת לאט. אבל הראפטור הקטן בטוח ליד אמו. היא מכסה אותו בכנפיה הנוצתיות, והם צופים יחד באור הכתום של הלבה שמאיר את שמי הערב.`,
    style: 'Realistic',
    movieLength: 'medium',
    characterDescription: 'Baby raptor — small, newly hatched, wet feathers in brown and cream tones, oversized curious golden eyes, tiny sharp claws, wobbly on its feet, about the size of a chicken. Mother raptor — large Velociraptor with iridescent green-blue feathers covering her body, piercing amber eyes, strong muscular legs, about 2 meters tall, protective posture. Both raptors have feathered bodies (scientifically accurate feathered dinosaurs, NOT scaly).',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  eduMath: {
    id: 'eduMath',
    prompt: `בכיתה עתידנית עם קירות שקופים שמשקיפים על עיר צפה בעננים, רובוט מורה בשם פרופסור קיוב עומד מול התלמידים. הוא רובוט ידידותי עם גוף כחול מתכתי, מסך פנים שמציג אימוג'ים, וזרועות שיכולות להקרין הולוגרמות.

פרופסור קיוב מקרין קובייה תלת-ממדית זוהרת באוויר. הקובייה מסתובבת לאט, ואז מתפרקת לשישה ריבועים שנפרשים בחלל — הילדים רואים בדיוק איך פריסת הקובייה עובדת.

תלמידה בשם נועה (ילדה בת 10 עם משקפיים עגולות ושיער שחור קצר) מרימה יד ושואלת: "מה קורה עם פירמידה?" פרופסור קיוב מחייך (אימוג'י שמח על המסך) ומקרין פירמידה זהובה ענקית שצומחת מהרצפה עד התקרה.

הפירמידה מתפרקת לחלקים — בסיס ריבועי וארבעה משולשים. הילדים יכולים לגעת בהולוגרמות ולסובב אותן. כל ילד בוחר צורה אחרת — כדור, גליל, חרוט — וההולוגרמות עפות בחדר כמו בלונים צבעוניים.

בסוף השיעור, כל הצורות מתחברות יחד ויוצרות עיר מיניאטורית תלת-ממדית שצפה באוויר — בתים מקוביות, גגות מפירמידות, כיפות מחצאי כדורים. הילדים מוחאים כפיים.`,
    style: 'Pixar',
    movieLength: 'medium',
    characterDescription: 'Professor Cube — friendly robot teacher with metallic blue body, rounded edges, face screen displaying emoji expressions, articulated arms that project holograms, small wheels for feet, about 1.5 meters tall, always animated and enthusiastic. Noa — 10-year-old girl with short black hair in a bob cut, round glasses, purple hoodie, bright curious eyes, olive skin.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  eduScience: {
    id: 'eduScience',
    prompt: `במעבדה מדעית קסומה עם ציוד זוהר וכלי מעבדה מבעבעים, פרופסור אטום — מדענית עם חלוק לבן, שיער אדום פרוע, ומשקפי מגן על המצח — מכינה את הניסוי הגדול.

היא מניחה כדור קטן וזוהר על השולחן ואומרת: "היום ניצור מערכת שמש!" הכדור מתחיל לגדול ולזהור — הוא הופך לשמש מיניאטורית שצפה באוויר. סביבה מתחילים להסתובב כדורים קטנטנים — כוכבי הלכת.

כדור הארץ הזעיר מתקרב ומתגדל עד שהילדים יכולים לראות את היבשות, האוקיינוסים, והעננים. פרופסור אטום מושכת חוט DNA ענקי מתוך בקבוק — סליל כפול זוהר בכחול וסגול שמסתובב לאט באוויר.

היא מגדילה את הDNA עד שאפשר לראות כל בסיס — A, T, G, C — כמו שלבים בסולם צבעוני. ואז היא נוגעת בבסיס אחד והוא מתחלף — מוטציה! הילדים רואים איך שינוי קטן משנה את כל המבנה.

בסיום, היא מערבבת שני נוזלים בכוס ענקית — פיצוץ של קצף צבעוני ממלא את כל החדר. הילדים צוחקים ומכוסים בקצף ורוד.`,
    style: 'Realistic',
    movieLength: 'medium',
    characterDescription: 'Professor Atom — female scientist in her 40s, wild frizzy red hair pulled back loosely, white lab coat with colorful stains, safety goggles pushed up on forehead, bright green eyes, warm smile, expressive hands. She has a small periodic table pin on her coat lapel.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  ted: {
    id: 'ted',
    prompt: `על במה עגולה אדומה מוארת, אדם צעיר בשם ד"ר אלון — לבוש חולצה לבנה מכופתרת וג'ינס כהה — עומד מול קהל של מאות אנשים. אור ספוט לבן מאיר אותו. הלוגו TED ענק מאחוריו.

"מה אם אני אגיד לכם," הוא אומר, "שהמוח שלכם ממציא את המציאות?" מאחוריו, הולוגרמת מוח ענקית תלת-ממדית צומחת באוויר — נוירונים מהבהבים באור כחול, סינפסות מתחברות כמו ברקים.

ד"ר אלון מצביע על אזור במוח — הוא מתרחב ונהיה ענק. הקהל רואה את התאים מקרוב: כל נוירון הוא כמו עץ עם ענפים זוהרים. הנתונים צפים באוויר — גרפים, מספרים, ויזואליזציות צבעוניות.

הוא מראה ניסוי חי: הקהל מתבקש לעצום עיניים. כשהם פותחים אותן, הבמה השתנתה — הם יושבים עכשיו בתוך הולוגרמת המוח. סינפסות נוצצות סביבם, גלי מוח גולשים מעליהם כמו אורורה.

"אתם חיים בתוך סימולציה שהמוח שלכם יצר," הוא מחייך. הקהל קם לתשואות. הוויזואליזציות מתפוצצות לזיקוקים דיגיטליים שממלאים את האולם.`,
    style: 'Realistic',
    movieLength: 'medium',
    characterDescription: 'Dr. Alon — young male scientist in his early 30s, short dark brown hair neatly styled, light stubble, warm confident smile, wearing a crisp white button-up shirt with sleeves rolled to elbows, dark navy jeans, brown leather shoes. Slim build, olive skin, dark brown eyes. Wears a small wireless microphone on his collar.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  advertising: {
    id: 'advertising',
    prompt: `בחדר חשוך לגמרי, פס אור זהוב בודד מאיר בקבוק בושם זכוכית אלגנטי. הבקבוק שקוף עם נוזל זהוב ופקק מתכתי מעוצב כיהלום.

טיפת בושם נופלת בהילוך איטי — כשהיא נוגעת במשטח, גל של אבק זהב מתפשט כמו גלים במים. חלקיקי זהב צפים באוויר באיטיות חלומית.

יד אישה אלגנטית עם לק כהה ותכשיט זהב אחד מושיטה יד לעבר הבקבוק. כשהיא נוגעת בו, הזכוכית מתחילה לזהור מבפנים, ואור זהוב מאיר את פניה.

הבקבוק מסתובב לאט באוויר — 360 מעלות. כל זווית חושפת השתקפות אחרת: שקיעה, פרחי יסמין, שמים מלאי כוכבים. הלוגו "LUMIÈRE" חרוט על הזכוכית.

הסצנה האחרונה: הבקבוק עומד על משטח שיש שחור, מוקף בעלי כותרת של ורדים זהובים שנופלים באיטיות מלמעלה. הטקסט מופיע: "LUMIÈRE — Light Your Essence".`,
    style: 'Realistic',
    movieLength: 'short',
    characterDescription: 'The perfume bottle — tall rectangular glass bottle with chamfered edges, transparent crystal-clear glass, golden amber liquid inside, diamond-shaped silver chrome cap, etched "LUMIÈRE" logo on front. Elegant female hand — slender fingers, dark burgundy nail polish, single thin gold bracelet, smooth fair skin.',
    selectedLanguages: ['he'],
    beCreative: false,
  },

  business: {
    id: 'business',
    prompt: `בחדר ישיבות עתידני עם קירות זכוכית שמשקיפים על קו רקיע של עיר בלילה, שולחן ארוך שחור מבריק משמש כמסך מגע ענקי. סביבו יושבים אנשי עסקים.

מנכ"לית צעירה בשם מאיה — חליפה כחולה כהה, שיער שחור ארוך אסוף, ביטחון שקט — עומדת בראש השולחן. היא מעבירה את ידה מעל השולחן, והולוגרמה תלת-ממדית של מוצר חדש צומחת מהמשטח.

המוצר — מכשיר טכנולוגי קטן בצורת כדור כסוף — מסתובב באוויר. מאיה מפרקת אותו בתנועת יד — כל רכיב צף בנפרד, ותוויות מסבירות כל חלק. הגרפים עולים — מכירות, שווקים, תחזיות.

המשקיעים סביב השולחן מתרשמים. אחד מהם מושיט יד ו"נוגע" בהולוגרמה — הגרף מתקרב ומראה נתונים מפורטים. מאיה מחייכת בביטחון.

בסצנה האחרונה, כל ההולוגרמות מתמזגות לעיר חכמה מיניאטורית שצפה מעל השולחן — חזון של העתיד. הלוגו של החברה מופיע מעל: "NEXUS — Building Tomorrow".`,
    style: 'Realistic',
    movieLength: 'medium',
    characterDescription: 'Maya the CEO — young woman in her early 30s, long straight black hair pulled into a sleek low ponytail, dark navy blue tailored suit, minimal gold earrings, confident posture, warm brown eyes, olive skin. The silver product sphere — perfectly smooth chrome sphere about the size of a tennis ball, with subtle glowing blue circuit lines across its surface.',
    selectedLanguages: ['he'],
    beCreative: false,
  },

  agency: {
    id: 'agency',
    prompt: `בסטודיו יצירתי פתוח עם קירות לבנים חשופים ונורות ניאון צבעוניות, צוות של סוכנות פרסום עובד על קמפיין חדש. שולחנות עץ גדולים מלאים במסכים, סקיצות, ודגמי צבעים.

הבמאית היצירתית, טליה — שיער קצר צבוע ורוד, קעקוע גיאומטרי על הזרוע, חולצה שחורה — מצביעה על מסך ענקי. היא מעבירה את ידה, ומוד-בורד דיגיטלי צומח באוויר — תמונות, צבעים, טיפוגרפיה, כולם צפים כמו חלונות AR.

המעצב, יובל — זקן מסודר, משקפיים עגולים, חולצת ג'ינס — גורר אלמנטים מהמוד-בורד ומסדר אותם לפרסומת. כל אלמנט שהוא מניח במקום מתפוצץ בצבעים.

הם מפעילים סימולציה של הקמפיין — הולוגרמה של רחוב עיר מופיעה, ושלטי חוצות דיגיטליים מציגים את הפרסומת שלהם. אנשים הולוגרפיים עוצרים ומסתכלים. הנתונים צפים: "87% engagement, 12M reach".

הצוות מוחא כפיים. טליה מחייכת ואומרת: "נשלח ללקוח." בלחיצת כפתור, הקמפיין עף מהמסך החוצה כמו ציפור דיגיטלית.`,
    style: 'Cyberpunk',
    movieLength: 'medium',
    characterDescription: 'Talia the creative director — young woman late 20s, short asymmetric bob dyed pastel pink, geometric black tattoo on left forearm, black crew-neck t-shirt, silver hoop earrings, confident creative energy, fair skin, hazel eyes. Yuval the designer — mid 30s male, neatly trimmed dark beard, round gold-rimmed glasses, denim button-up shirt, friendly focused expression, olive skin.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  creator: {
    id: 'creator',
    prompt: `בחדר צילום ביתי צבעוני, יוצר תוכן בשם אורי — בחור בן 22 עם שיער מתולתל חום, חולצת טי עם הדפס רטרו, ואוזניות ענקיות על הצוואר — יושב מול מצלמה ומיקרופון מקצועי.

"שלום לכולם!" הוא קורא בהתלהבות. מאחוריו קיר מלא בנורות LED צבעוניות ופוסטרים. הוא לוחץ על כפתור, ופורטל צבעוני נפתח מאחוריו — מעגל של אנרגיה ורודה וכחולה.

אורי קופץ דרך הפורטל — וכשהוא מגיע לצד השני, הוא בעולם אנימציה. הוא עכשיו דמות מצוירת בסגנון פיקסר, עם עיניים ענקיות ובעות קומיות. סביבו צפים כפתורי "Subscribe" ו-"Like" ענקיים כמו בלונים.

הוא רץ דרך נוף דיגיטלי — גבעות עשויות מכפתורי Play, עצים מסרטוני וידאו, ושמש בצורת כפתור Record אדום. כל מקום שהוא נוגע בו מתעורר לחיים בצבעים.

בסוף הוא מגיע לפסגת הר ומסתכל על נוף ענק — מיליוני מסכים קטנים, כל אחד עם צופה אחר, כולם מחייכים. הטקסט מופיע: "Your story. Your world. Create."`,
    style: 'Pixar',
    movieLength: 'medium',
    characterDescription: 'Ori the content creator — 22-year-old male, curly brown hair falling over forehead, big expressive brown eyes, retro graphic t-shirt (yellow with vintage TV print), large blue over-ear headphones around neck, warm smile showing slight dimples, light skin, slim build. In animated form: same features but with exaggerated Pixar-style proportions — bigger eyes, rounder head, more expressive.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  cooking: {
    id: 'cooking',
    prompt: `במטבח מקצועי מבריק עם משטחי נירוסטה ותאורה דרמטית, שף מאסטר בשם שף דניאל — חולצת שף לבנה, כובע שף גבוה, שפם מסודר — מתחיל להכין את המנה המושלמת.

הוא זורק ירקות לאוויר — גזר, פלפל אדום, בצל — והם מסתובבים בהילוך איטי. סכין ענקית עפה וחותכת אותם באוויר לפרוסות מושלמות. הפרוסות נופלות כמו עלי שלג למחבת רותחת.

קיטור דרמטי עולה מהמחבת. שף דניאל מוסיף שמן זית — זרם זהוב שזורם בהילוך איטי כמו משי. כשהשמן נוגע במחבת, להבות קטנות קופצות — פלמבה מרהיבה שמאירה את פניו.

הוא מוסיף תבלינים — אבקות צבעוניות שמרחפות באוויר כמו ענני קסם: פפריקה אדומה, כורכום זהוב, פלפל שחור. הריחות כמעט מורגשים דרך המסך.

המנה המוגמרת: סטייק מושלם על צלחת לבנה, עם ירקות צלויים מסודרים כמו יצירת אמנות, טפטוף של רוטב בלסמי יוצר דוגמה אלגנטית. שף דניאל מניח את הצלחת, מסיר את הכובע, ומשתחווה.`,
    style: 'Realistic',
    movieLength: 'medium',
    characterDescription: 'Chef Daniel — male chef in his 50s, distinguished salt-and-pepper neatly trimmed mustache, clean-shaven otherwise, tall white chef hat (toque), pristine white double-breasted chef coat, kind confident dark eyes, olive skin, slightly weathered hands showing years of culinary mastery. Stocky build, warm grandfatherly presence.',
    selectedLanguages: ['he'],
    beCreative: false,
  },

  travel: {
    id: 'travel',
    prompt: `בזריחה, חוקרת צעירה בשם מאיה — תיק גב חום, כובע פדורה, חולצת קאקי — עומדת על צוק ומשקיפה על עמק ירוק אינסופי מכוסה ערפל בוקר. שמש זהובה עולה מאחורי הרים סגולים.

היא יורדת בשביל מעוקל דרך יער טרופי. אור שמש חודר בין העלים הענקיים ויוצר כתמי אור זהובים על הקרקע. ציפורים אקזוטיות צבעוניות עפות סביבה — תוכי אדום, ציפור גן עדן כחולה.

בסוף השביל — מקדש עתיק חצי-בלוע על ידי הג'ונגל. עצים ענקיים גדלים מתוך אבני המקדש, שורשיהם מתפתלים כמו נחשים סביב עמודים חרוטים. מאיה מגיעה לכניסה — שער אבן ענק עם גילופי דרקונים.

בתוך המקדש — חדר עצום עם תקרה שקרסה, ושמש חודרת פנימה ומאירה פסל זהב עתיק במרכז. אבק זהב רוחף באוויר. מאיה מוציאה מצלמה ומצלמת — הפלאש מאיר ציורי קיר עתיקים שצבעם עדיין חי.

בסצנה האחרונה, מאיה יושבת על מדרגות המקדש בשקיעה. שמש כתומה שוקעת מאחורי ההרים. היא כותבת ביומן, מחייכת, ומסתכלת לאופק.`,
    style: 'Realistic',
    movieLength: 'medium',
    characterDescription: 'Maya the explorer — young woman late 20s, sun-kissed tan skin, dark brown wavy hair pulled back in a messy low bun, brown leather fedora hat, khaki short-sleeve button-up shirt, olive cargo pants, worn brown hiking boots, weathered brown leather backpack, vintage film camera around neck, a few freckles across nose, bright adventurous hazel eyes.',
    selectedLanguages: ['he'],
    beCreative: true,
  },

  music: {
    id: 'music',
    prompt: `באצטדיון ענק מלא ב-100,000 צופים, הבמה מוארת בחושך מוחלט. רק נקודה אדומה אחת מהבהבת. הקהל דומם.

פתאום — פיצוץ של אור! מאות קרני לייזר ירוקות, כחולות וסגולות חותכות את החשיכה. הבמה נחשפת — מבנה ענק בצורת פירמידה עם מסכי LED שמציגים ויזואליות קוסמיות. הזמרת עולה על במה מעלית — סילואט בשמלה ארוכה כסופה.

היא מתחילה לשיר — וכל תו מוזיקלי הופך לאלמנט ויזואלי. תווים נמוכים יוצרים גלי אנרגיה שמתפשטים מהבמה כמו גלים. תווים גבוהים הופכים לזיקוקים שמתפוצצים בשמיים.

הקהל מנופף עם טלפונים — ים של אורות כמו כוכבים. פירוטכניקה מתפוצצת — גייזרים של אש משני צדי הבמה, גשם של ניצוצות כסופים מהתקרה. המוזיקה עולה לשיא.

ברגע השיא — כל האורות נכבים לשנייה אחת של דממה. ואז: פיצוץ אחרון ענק של זיקוקים, קונפטי צבעוני, ולייזרים בכל כיוון. הזמרת משתחווה. 100,000 איש עומדים ומריעים. האורות של הטלפונים מתנדנדים לאט.`,
    style: 'Cyberpunk',
    movieLength: 'medium',
    characterDescription: 'The singer — female performer in her late 20s, tall and commanding stage presence, long flowing silver-white hair, floor-length metallic silver dress that reflects light like liquid mercury, dramatic dark eye makeup with silver accents, confident powerful posture. The stage — massive pyramid structure with embedded LED panels, industrial metal framework, moving spotlights, pyrotechnic launchers on both sides.',
    selectedLanguages: ['he'],
    beCreative: true,
  },
};

export const getTemplate = (id: string): IdeaTemplate | undefined => TEMPLATES[id];
