import { useEffect } from 'react';

class ScrollLockManager {
  private static instance: ScrollLockManager;
  private lockCount: number = 0;
  private scrollPosition: number = 0;
  private scrollbarWidth: number = 0;

  private constructor() {
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  public static getInstance(): ScrollLockManager {
    if (!ScrollLockManager.instance) {
      ScrollLockManager.instance = new ScrollLockManager();
    }
    return ScrollLockManager.instance;
  }

  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }

  public enableScrollLock(): void {
    this.lockCount++;
    
    if (this.lockCount === 1) {
      this.scrollPosition = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
      document.body.classList.add('scroll-locked');
    }
  }

  public disableScrollLock(): void {
    if (this.lockCount > 0) {
      this.lockCount--;

      if (this.lockCount === 0) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('scroll-locked');
        window.scrollTo(0, this.scrollPosition);
      }
    }
  }

  public isLocked(): boolean {
    return this.lockCount > 0;
  }
}

export const scrollLockManager = ScrollLockManager.getInstance();

export function useScrollLock(isActive: boolean) {
  useEffect(() => {
    if (isActive) {
      scrollLockManager.enableScrollLock();
    } else {
      scrollLockManager.disableScrollLock();
    }

    return () => {
      if (isActive) {
        scrollLockManager.disableScrollLock();
      }
    };
  }, [isActive]);
}