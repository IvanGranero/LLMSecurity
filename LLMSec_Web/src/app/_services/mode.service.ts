// mode.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private modeSubject = new BehaviorSubject<'flag' | 'attacker' | 'defender'>('attacker');
  mode$ = this.modeSubject.asObservable();

  setMode(mode: 'flag' | 'attacker' | 'defender') {
    this.modeSubject.next(mode);
  }

  get currentMode(): 'flag' | 'attacker' | 'defender' {
    return this.modeSubject.value;
  }
}
