🚀🚀🚀 Alert Doc - მიშო სილაგავა

Lib Link - https://tia-frontend.netlify.app/admin/library/alerts


ალერტი დავყავი 5 ტიპად, რომ ნაკლები ინფუთები და მეტი თავისუფლება გვქონდეს კომპონენტზე მუშაობისას.

დოკუმენტაციაში შეცდომის ან გაურკვევლობის შემთხვევაში დამიკავშირდით

თუ ელემენტი შესასწორებელია არ მომწეროთ ესეიგი თქვენშია პრობლემა🚀



1) 🚨 Basic Alert - ბეისიქ ალერტს აქვს 4 input:

- alertType<BaseAlertType>, რომელსაც შეიძლება გადაეწოდოს ორი მნიშვნელობა: "error" | "default".
    ამ ტიპზე დაკვირვებით გამოითვლება ალერტის ICON path, Card Styles, Default ErrorMessage.

- alertTitle(string) - ალერტის სათაურის დინამიური მიწოდებისთის

- alertMessage(string) - ალერტის მესიჯის დინამიური მიწოდებისთის

- alertState<AlertStateType> - შეიძლება მიენიჭოს 3 მნიშვნელობა: "default" | "inactive" | "active"
(დეფულტი): 'default' - ჩვეულებრივი ალერტი,
             'inactive' - ალერტი არა აქტიური სტილით,
             'active' - ალერტი აქტიური სტილით,

⚠️ გამოყენებული: Lib Page-ზე გამოიყენებულია პირველ და ბოლო კომპონენტში


2) 🚨 Alert Types with Icons - ალერტს აქვს 2 input:


- alertType<AlertType>, შეიძლება მიენიჭოს 4 მნიშვნელობა: "information" | "success" | "error" | "warning",
 ამ ტიპზე დაკვირვებით გამოითვლება ალერტის, ICON path, Card Styles.
    (დეფულტი): 'information'


- alertMessage<string> - ალერტის მესიჯის დინამიური მიწოდებისთის.


⚠️ გაითვალისწინეთ: alertType არის ამ ალერტის სათაური.

⚠️ გამოყენებული: Lib Page-ზე გამოიყენებულია მეორე კომპონენტში.



3) ‼️🚨 Dismissible Alerts -  ალერტს აქვს 1(optional) output და 4 input:
    id(number)

    alertTitle(string)

    alertMessage(string)

    alertType<DismissibleAlertType> - შეიძლება მიენიჭოს: "information" | "success" | "warning"
    (დეფულტი): 'information',

   ⚠️ dismissed - output(number), რომელიც გაისვრის onDismiss-ზე დაჭერისას.

   ⚠️ გამოყენებული: Lib Page-ზე გამოიყენებულია მესამე კომპონენტში.



4) ‼️🚨 Alerts with Actions -  ალერტს აქვს 3 input და ngContent:

    alertType<BaseAlertType> - "default" | "error"
    (დეფულტი): 'default'

    ⚠️alertType -> 'error' - warning სტილის ალერტი.

    alertTitle(string);

    alertType(string);  

    ‼️ ngContent - ით გადააწვდით თქვენთვის სასურველ Button-ებს ფუნქციებიანად.



5)  🚨Simple Alerts - გადაეცემა 2 input:

    alertType<SimpleAlertType> - "information" | "success" | "warning"

    alertMessage(string);

