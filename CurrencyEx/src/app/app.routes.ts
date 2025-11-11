import { Routes } from '@angular/router';
import { Conversion } from './components/conversion/conversion';
import { Storico } from './components/storico/storico';

export const routes: Routes = [

    //path per le pagine di conversione e lo storico delle valute
    { path: 'conversion', component: Conversion },
    { path: 'storico', component: Storico }

    //se la path è vuota non va su nessuna delle due, perchè rimane sulla homepage
]