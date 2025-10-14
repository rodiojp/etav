import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ProfileTemplates {
  header: TemplateRef<any> | null;
  content: TemplateRef<any> | null;
  actions: TemplateRef<any> | null;
}

@Injectable({
  providedIn: 'root',
})
export class SharedDialogTemplatesService {
  private profileTemplateSources = new Subject<ProfileTemplates>();

  // Expose as observable for consumers
  readonly profileTemplates$: Observable<ProfileTemplates> =
    this.profileTemplateSources.asObservable();

  // Update one or more parts of the template set
  updateProfileTemplates(templates: ProfileTemplates): void {
    this.profileTemplateSources.next(templates);
  }
}
