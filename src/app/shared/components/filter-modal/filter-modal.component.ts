import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroXMark,
  heroChevronRight,
} from '@ng-icons/heroicons/outline';

export interface FilterValues {
  types: {
    [key: string]: boolean;
  };
  engine: string;
  size: number | null;
  status?: 'all' | 'available' | 'reserved';
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [
    provideIcons({ heroMagnifyingGlass, heroXMark, heroChevronRight }),
  ],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss',
})
export class FilterModalComponent implements OnChanges {
  @Input() show = false;
  @Input() filters: FilterValues = {
    types: {},
    engine: '',
    size: null,
  };
  @Input() showStatusFilter = false;
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<FilterValues>();
  @Output() clear = new EventEmitter<void>();

  localFilters: FilterValues = {
    types: {},
    engine: '',
    size: null,
  };

  expandedSections = {
    status: false,
    types: false,
    engine: false,
    size: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue === true) {
      this.localFilters = JSON.parse(JSON.stringify(this.filters));
    }
  }

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

  statusOptions: { key: 'all' | 'available' | 'reserved'; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'available', label: 'Disponíveis' },
    { key: 'reserved', label: 'Reservados' },
  ];

  engineOptions = ['1.0', '1.4', '1.6', '1.8', '2.0'];
  sizeOptions = [2, 3, 4, 5, 6, 7];

  toggleSection(section: 'status' | 'types' | 'engine' | 'size'): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  selectStatus(status: 'all' | 'available' | 'reserved'): void {
    this.localFilters.status = this.localFilters.status === status ? 'all' : status;
  }

  selectEngine(engine: string): void {
    this.localFilters.engine = this.localFilters.engine === engine ? '' : engine;
  }

  selectSize(size: number): void {
    this.localFilters.size = this.localFilters.size === size ? null : size;
  }

  onClose(): void {
    this.close.emit();
  }

  onApply(): void {
    this.apply.emit(JSON.parse(JSON.stringify(this.localFilters)));
  }

  onClear(): void {
    this.localFilters = {
      types: {},
      engine: '',
      size: null,
      status: 'all',
    };
    this.clear.emit();
  }
}
