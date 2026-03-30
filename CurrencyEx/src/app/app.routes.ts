import { Routes } from '@angular/router';
import { Conversion } from './components/conversion/conversion';
import { Storico } from './components/storico/storico';
import { Grafico } from './components/grafico/grafico';

export const routes: Routes = [
    { path: 'conversion', component: Conversion },
    { path: 'storico',    component: Storico    },
    { path: 'grafico',    component: Grafico    },
];
