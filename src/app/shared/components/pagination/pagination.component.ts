import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center gap-4 py-8">
      <div class="flex items-center gap-2">
        <button (click)="previousPage()" [disabled]="currentPage === 0" class="pagination-arrow">
          <i-lucide name="chevron-left" class="w-5 h-5"></i-lucide>
        </button>
        <ng-container *ngFor="let page of displayedPages(); let i = index">
          <ng-container *ngIf="page === '...'; else pageBtn"></ng-container>
          <ng-template #pageBtn>
            <ng-container *ngIf="isNumber(page)">
              <button (click)="goToPage(page - 1)"
                      [class.active]="page - 1 === currentPage"
                      class="pagination-number">
                {{ page }}
              </button>
            </ng-container>
            <ng-container *ngIf="!isNumber(page)">
              <span class="pagination-dots">...</span>
            </ng-container>
          </ng-template>
        </ng-container>
        <button (click)="nextPage()" [disabled]="currentPage >= totalPages - 1" class="pagination-arrow">
          <i-lucide name="chevron-right" class="w-5 h-5"></i-lucide>
        </button>
      </div>
      <p class="text-sm text-gray-400">
        Página {{ currentPage + 1 }} de {{ totalPages }}
      </p>
    </div>
  `,
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  previousPage() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  displayedPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage + 1;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  }

  isNumber(value: any): value is number {
    return typeof value === 'number';
  }
}
