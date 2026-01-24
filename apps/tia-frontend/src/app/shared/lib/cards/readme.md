app/shared/lib/cards/  
├── basic-card/ - basic ბარათი
├── statistic-card/ - statistic ბარათი
└── models/ - ინტერფეისები

                                                                Basic Card - გამოყენება

<app-basic-card
[title]="'სათაური'"
[subtitle]="'აღწერა'"
[content]="'კონტენტი '"
[hasFooter]="true ან false"  
[hasHover]="ჰოვერი ჰქონდეს თუ არა, boolean"
[width]="'სიგანე რამდენიც გინდათ'"
[height]="'სიმაღლე რამდენიც გინდათ'">
[flex]="'grow/shrink/basic'"
[minWidth]="'minwidth-ის ზომა'"
[maxWidth]="'maxwidth -ის ზომა'"
[display]="'flex ან grid'" 
[flexDirection]="'მიმართულება'"
[alignItems]="'y ღერძე განლაგება'"
[justifyContent]="'x ღერძე განლაგება'"
  <div card-footer>
    <app-button>Action</app-button>
  </div>
</app-basic-card>



Inputs:

title - (optional)
subtitle - (optional)
content - (optional)
hasFooter - (default: false)
hasHover(-default:false)
width - (optional)
height - (optional)
flex - (optional)
minWidth - (optional)
maxWidth - (optional)
 display    - (optional)                                                             
flexDirection - (optional)
alignItems - (optional)
justifyContent - (optional)

 

                                                                           Statistic Card - გამოყენება

<app-statistic-card
[label]="'სულ Revenue'"
[value]="'$თანხა'"
[change]="'მაგ: +20.1% from last month'"
[changeType]="'positive ან negative'"
[icon]="'images/svg/cards/dolar.svg'" />

Inputs:

label -(required)
value - (required)
change - (required)
changeType - 'positive' ან 'negative' (required)
icon - აიქონის ურლ (required)



