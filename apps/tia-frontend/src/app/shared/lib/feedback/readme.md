Feedback Component:

There's 3 types of skeletons: Text, Circle, Paragraph

To use each one, we send a variant parameter when using <app-skeleton> in such way:

<app-skeleton [variant]="card.avatar.variant" />

We can also give our sizes of a skeleton whenever using <app-skeleton>:

<app-skeleton [height]="card.avatar.height" width = "card.avatar.width">

Outside of this, we also have a normal spinner, that takes size as a parameter:

<app-spinner [size] = '4rem'>

And we also have route loaders, Top bar, full page and pulsing. Route loaders take variant and text as their properties:

<app-route-loader [variant] = 'pulsing' [text] = "Loading"> 

