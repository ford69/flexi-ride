import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Upload, Plus, Minus, MapPin, Car as CarIcon,
  Coins, Tag
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';


type FormValues = {
  make: string;
  model: string;
  year: number;
  type: string;
  description: string;
  dailyRate: number;
  location: string;
  features: string[];
  images: File[];
};

const carTypes = [
  'Sedan',
  'SUV',
  'Truck',
  'Sports',
  'Luxury',
  'Electric',
  'Convertible',
  'Van',
];

const AddCarPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxImages = 6;

    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/')
      );

      const totalImages = images.length + selectedFiles.length;
      if (totalImages > maxImages) {
        alert(`You can upload a maximum of ${maxImages} images.`);
        return;
      }

      setImages(prev => [...prev, ...selectedFiles]);

      // Create preview URLs and track them for cleanup
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }

    // Clear the input to allow re-selection of the same files
    e.target.value = '';
  };


  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeatureField = () => {
    setFeatures([...features, '']);
  };

  const removeFeatureField = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!user) return;
    setIsSubmitting(true);

    const filteredFeatures = features.filter(feature => feature.trim() !== '');
    const formData = new FormData();

    formData.append('ownerId', user.id); // ✅ Set from authenticated user
    formData.append('make', values.make);
    formData.append('model', values.model);
    formData.append('year', values.year.toString());
    formData.append('type', values.type);
    formData.append('description', values.description);
    formData.append('dailyRate', values.dailyRate.toString());
    formData.append('location', values.location);

    filteredFeatures.forEach((feature) => {
      formData.append('features', feature);
    });

    images.forEach((imageFile) => {
      formData.append('images', imageFile);
    });

    try {
      await axios.post('http://localhost:5001/api/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`, // ✅ Include token to authenticate
        },
      });

      alert('✅ Car added successfully!');
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('❌ Failed to add car:', error);
      alert('Error submitting car. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Add a New Car</h1>
          <p className="text-gray-400 mt-1">List your car on FlexiRide and start earning</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">Car Details</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Make"
                      error={errors.make?.message}
                      {...register('make', { required: 'Make is required' })}
                      placeholder="e.g. Toyota, BMW, Tesla"
                      icon={<CarIcon className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      label="Model"
                      error={errors.model?.message}
                      {...register('model', { required: 'Model is required' })}
                      placeholder="e.g. Camry, X5, Model 3"
                      icon={<CarIcon className="h-5 w-5 text-gray-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">Year</label>
                      <Input
                        type="number"
                        error={errors.year?.message}
                        {...register('year', {
                          required: 'Year is required',
                          min: { value: 1990, message: 'Year must be 1990 or later' },
                          max: { value: new Date().getFullYear() + 1, message: `Year cannot be later than ${new Date().getFullYear() + 1}` }
                        })}
                        placeholder="e.g. 2022"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">Type</label>
                      <select
                        className="w-full px-4 py-2 bg-background-light text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent border-gray-700"
                        {...register('type', { required: 'Type is required' })}
                      >
                        <option value="">Select Type</option>
                        {carTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.type && <p className="mt-1 text-sm text-error">{errors.type.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
                    <textarea
                      className="w-full px-4 py-2 bg-background-light text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent border-gray-700"
                      rows={4}
                      placeholder="Describe your car, its condition, special features, etc."
                      {...register('description', {
                        required: 'Description is required',
                        minLength: { value: 50, message: 'Description should be at least 50 characters' }
                      })}
                    ></textarea>
                    {errors.description && <p className="mt-1 text-sm text-error">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Daily Rate (¢)"
                      type="number"
                      error={errors.dailyRate?.message}
                      {...register('dailyRate', {
                        required: 'Daily rate is required',
                        min: { value: 500, message: 'Rate must be at least ¢500' }
                      })}
                      placeholder="e.g. 85"
                      icon={<Coins className="h-5 w-5 text-gray-400" />}
                    />

                    <Input
                      label="Location"
                      error={errors.location?.message}
                      {...register('location', { required: 'Location is required' })}
                      placeholder="e.g. Cantoments, Osu"
                      icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">Photos</h2>
                  <p className="text-sm text-gray-400 mt-1">Upload photos of your car (min. 1, max. 6)</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Car image ${index + 1}`}
                          className="h-32 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-error rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}

                    {imagePreviews.length < 6 && (
                      <label className="h-32 border-2 border-dashed border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          multiple
                        />
                      </label>
                    )}
                  </div>

                  {imagePreviews.length === 0 && (
                    <p className="text-sm text-error">Please upload at least one photo of your car</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Features</h2>
                      <p className="text-sm text-gray-400 mt-1">Add features to highlight your car's benefits</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addFeatureField}
                      icon={<Plus className="h-4 w-4 mr-1" />}
                    >
                      Add Feature
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder="e.g. Leather Seats, Sunroof, Navigation"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            icon={<Tag className="h-5 w-5 text-gray-400" />}
                          />
                        </div>
                        {features.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error/10"
                            onClick={() => removeFeatureField(index)}
                            icon={<Minus className="h-4 w-4" />}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-white">Listing Summary</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-gray-300">
                      <p>Your car will be reviewed by our team before it's listed publicly.</p>
                      <p>Approval usually takes 1-2 business days.</p>
                      <p>Make sure all information is accurate and photos clearly show the car's condition.</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={isSubmitting}
                      disabled={images.length === 0}
                    >
                      Submit for Review
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="mt-6">
                  <CardContent>
                    <div className="space-y-4 text-gray-300 text-sm">
                      <div>
                        <h3 className="text-white font-medium mb-1">Tips for faster approval:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Use clear, well-lit photos</li>
                          <li>Include interior and exterior shots</li>
                          <li>Be accurate about the car's condition</li>
                          <li>Add detailed description and features</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">Need help?</h3>
                        <p>Contact our support team for assistance with listing your car.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarPage;