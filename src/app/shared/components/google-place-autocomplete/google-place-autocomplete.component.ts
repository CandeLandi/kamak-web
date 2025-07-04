import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, map, Observable, of } from 'rxjs';

@Component({
  selector: 'google-place-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './google-place-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GooglePlaceAutocompleteComponent),
      multi: true
    }
  ]
})
export class GooglePlaceAutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() label = 'Ubicación';
  @Input() placeholder = 'Buscar dirección o ciudad';
  @Output() placeSelected = new EventEmitter<{ address: string, lat: number, lng: number }>();

  addressControl = new FormControl('');
  options: google.maps.places.AutocompletePrediction[] = [];
  isLoading = false;

  private onChange = (_: any) => {};
  public onTouched = () => {};

  ngOnInit() {
    this.addressControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (!value || value.length < 3) {
          this.onChange(null);
          return of([]);
        }
        this.isLoading = true;
        return this.getPlacePredictions(value);
      })
    ).subscribe((results: google.maps.places.AutocompletePrediction[]) => {
      this.options = results;
      this.isLoading = false;
    });
  }

  getPlacePredictions(input: string): Observable<google.maps.places.AutocompletePrediction[]> {
    return new Observable(observer => {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          observer.next(predictions);
        } else {
          observer.next([]);
        }
        observer.complete();
      });
    });
  }

  onOptionSelected(option: google.maps.places.AutocompletePrediction) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: option.place_id }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry?.location;
        if (location) {
          const value = {
            address: results[0].formatted_address,
            lat: location.lat(),
            lng: location.lng()
          };
          this.addressControl.setValue(results[0].formatted_address, { emitEvent: false });
          this.onChange(value);
          this.placeSelected.emit(value);
        }
      }
    });
  }

  writeValue(value: any): void {
    if (value && value.address) {
      this.addressControl.setValue(value.address, { emitEvent: false });
    } else {
      this.addressControl.setValue('', { emitEvent: false });
    }
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
