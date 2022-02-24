import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Paginas
import { TaskComponent } from './pages/task/task.component';
import { GridComponent } from './pages/grid/grid.component';
import { LayoutComponent } from './components/layout/layout.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // hijos
    children: [
      {
        path: '',
        redirectTo: 'grid',
        pathMatch: 'full'
      },
      {
        path: 'grid',
        component: GridComponent
      },
      {
        path: 'task',
        component: TaskComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
