import React, { useRef } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { X } from 'lucide-react';

interface Place {
  label: string;
  value: {
    description: string;
    place_id: string;
    reference: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
      main_text_matched_substrings: { length: number; offset: number }[];
    };
    terms: {
      offset: number;
      value: string;
    }[];
    types: string[];
  };
}

interface LocationInputProps {
  onSelect: (details: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ onSelect, placeholder = "Location (city, state)" }) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = React.useState<Place | null>(null);

  const handleSelect = async (place: Place | null) => {
    setValue(place);
    if (!place) {
      onSelect({ address: '', lat: 0, lng: 0 });
      return;
    }
    try {
      const results = await geocodeByAddress(place.label);
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({
        address: place.label,
        lat,
        lng,
      });
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  return (
    <div className="relative">
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: handleSelect,
          placeholder: placeholder,
          isClearable: true,
          ref: inputRef,
          styles: {
            control: (provided, state) => ({
              ...provided,
              backgroundColor: '#f3f4f6',
              border: state.isFocused ? '1.5px solid #059669' : '1px solid #d1d5db',
              boxShadow: state.isFocused ? '0 0 0 2px #05966922' : 'none',
              borderRadius: '0.5rem',
              minHeight: '48px',
              paddingLeft: '2.5rem',
              fontSize: '1rem',
            }),
            input: (provided) => ({
              ...provided,
              backgroundColor: 'transparent',
              color: '#111827',
              fontSize: '1rem',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? '#e0f2f1' : '#fff',
              color: '#111827',
              fontWeight: state.isSelected ? 'bold' : 'normal',
              fontSize: '1rem',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: '#111827',
              fontSize: '1rem',
            }),
            placeholder: (provided) => ({
              ...provided,
              color: '#9ca3af',
              fontSize: '1rem',
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: '#059669',
              padding: '0 8px',
            }),
            clearIndicator: (provided) => ({
              ...provided,
              color: '#059669',
              padding: '0 8px',
            }),
            indicatorSeparator: () => ({ display: 'none' }),
            menu: (provided) => ({
              ...provided,
              zIndex: 50,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 24px 0 #00000011',
              marginTop: 2,
            }),
          },
        }}
        autocompletionRequest={{
          componentRestrictions: {
            country: ['gh'],
          },
        }}
      />
      {/* Icon on the left */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <circle cx="12" cy="11" r="3" />
        </svg>
      </span>
    </div>
  );
};

export default LocationInput; 