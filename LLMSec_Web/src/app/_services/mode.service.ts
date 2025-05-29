// mode.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private modeSubject = new BehaviorSubject<'attacker' | 'defender'>('attacker');
  mode$ = this.modeSubject.asObservable();

  setMode(mode: 'attacker' | 'defender') {
    this.modeSubject.next(mode);
  }

  get currentMode(): 'attacker' | 'defender' {
    return this.modeSubject.value;
  }
}
