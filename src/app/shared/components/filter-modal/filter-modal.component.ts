import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterValues {
  types: {
    [key: string]: boolean;
  };
  engine: string;
  size: number | null;
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss',
})
export class FilterModalComponent {
  @Input() show = false;
  @Input() filters: FilterValues = {
    types: {},
    engine: '',
    size: null,
  };
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<FilterValues>();
  @Output() clear = new EventEmitter<void>();

  expandedSections = {
    types: false,
    engine: false,
    size: false,
  };

  typeOptions = [
    { key: 'hatchCompact', label: 'Hatch compacto' },
    { key: 'pickupMid', label: 'Picape leve-média' },
    { key: 'hatchMid', label: 'Hatch médio' },
    { key: 'pickupMid2', label: 'Picape média' },
    { key: 'suvCompact', label: 'SUV compacto' },
    { key: 'sedanCompact', label: 'Sedan Compacto' },
    { key: 'suvMid', label: 'SUV médio' },
    { key: 'sedanMid', label: 'Sedan Médio' },
    { key: 'suvLarge', label: 'SUV grande' },
    { key: 'sedanLarge', label: 'Sedan Grande' },
    { key: 'crossover', label: 'Crossover' },
    { key: 'minivanMonovolume', label: 'Minivan/monovolume' },
    { key: 'coupe', label: 'Coupé' },
    { key: 'utilityLight', label: 'Utilitário leve' },
    { key: 'pickupLight2', label: 'Picape leve' },
    { key: 'utility', label: 'Utilitário' },
  ];

  engineOptions = ['1.0', '1.4', '1.6', '1.8', '2.0'];
  sizeOptions = [2, 3, 4, 5, 6, 7];

  toggleSection(section: 'types' | 'engine' | 'size'): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  selectEngine(engine: string): void {
    this.filters.engine = this.filters.engine === engine ? '' : engine;
  }

  selectsizes(size: number): void {
    this.filters.size = this.filters.size === size ? null : size;
  }

  onClose(): void {
    this.close.emit();
  }

  onApply(): void {
    this.apply.emit(this.filters);
  }

  onClear(): void {
    this.clear.emit();
  }
}
