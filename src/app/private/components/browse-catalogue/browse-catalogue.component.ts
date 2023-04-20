import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { CardBoxComponent } from '../../../shared/components/card-box/card-box.component';
import { ServiceOfferResponsePayloadModel } from '../../models';
import { ServiceOfferingService } from '../../services';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShareInformationDialogComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-browse-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CardBoxComponent,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './browse-catalogue.component.html',
  styleUrls: ['./browse-catalogue.component.scss'],
})
export class BrowseCatalogueComponent {
  serviceList: ServiceOfferResponsePayloadModel[] = [];

  product = new FormControl('');
  products: string[] = ['Be Positive', 'Audi', 'ISRO', 'Google'];
  filteredProducts!: Observable<string[]>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private serviceOfferingService: ServiceOfferingService
  ) {}

  ngOnInit() {
    this.getServiceOffering();
    // this.filteredProducts = this.product.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter(value || ''))
    // );
  }

  getServiceOffering() {
    this.serviceOfferingService.getCatalogue({}).subscribe((data) => {
      this.serviceList = data.payload;
    });
  }

  // private _normalizeValue(value: string): string {
  //   return value.toLowerCase().replace(/\s/g, '');
  // }

  onShowFilter = () => {};

  onShareInfo = (onShareInfo: ServiceOfferResponsePayloadModel) => {
    const dialogRef = this.dialog.open(ShareInformationDialogComponent, {
      width: '60rem',
      data: {},
    });
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
      }
    });
  };
}
