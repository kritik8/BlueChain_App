import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, Video, Upload, X, Check, Clock, Edit3, ChevronLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MapModal from '../MapModal';
import type { Project } from '@/types';

const GeneratorScreen: React.FC = () => {
  const { projects, addProject, showToast, setActiveTab } = useApp();
  const [projectName, setProjectName] = useState('');
  const [hectares, setHectares] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    setIsMapOpen(false);
    if (location) {
      showToast('info', 'Location Updated', 'Your project location has been changed.');
    } else {
      showToast('success', 'Location Selected', 'Project location has been set.');
    }
  }, [location, showToast]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPhotos(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const [validationErrors, setValidationErrors] = useState<{ name?: string; hectares?: string; location?: string }>({});

  const handleSubmit = () => {
    const errors: { name?: string; hectares?: string; location?: string } = {};
    
    if (!projectName.trim()) {
      errors.name = 'Project name is required';
    }
    if (!hectares || parseFloat(hectares) <= 0) {
      errors.hectares = 'Valid hectares is required';
    }
    if (!location) {
      errors.location = 'Location is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast('error', 'Missing Fields', 'Please fill all required fields.');
      return;
    }
    
    setValidationErrors({});

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      hectares: parseFloat(hectares),
      location,
      photos,
      video,
      date: new Date().toISOString().split('T')[0],
      status: 'under-review',
    };

    addProject(newProject);
    showToast('success', 'Project Submitted Successfully', 'Your project is now under review.');

    // Reset form
    setProjectName('');
    setHectares('');
    setLocation(null);
    setPhotos([]);
    setVideo(null);
  };

  const pastSubmissions = projects.slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="gradient-header pt-14 pb-8 px-5 relative">
        <button 
          onClick={() => setActiveTab('home')}
          className="absolute top-14 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Generator Dashboard</h1>
          <p className="text-white/80 text-sm mt-1">Submit Blue Carbon Projects</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 -mt-4 scrollbar-hide">
        {/* New Project Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5 mb-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">📝</span>
            New Project Submission
          </h2>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Project Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g., Sundarbans Mangrove Restoration"
                className={`input-field ${validationErrors.name ? 'border-destructive ring-1 ring-destructive' : ''}`}
              />
              {validationErrors.name && (
                <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Hectares */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Hectares Restored <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={hectares}
                onChange={(e) => {
                  setHectares(e.target.value);
                  if (validationErrors.hectares) setValidationErrors(prev => ({ ...prev, hectares: undefined }));
                }}
                placeholder="e.g., 150"
                className={`input-field ${validationErrors.hectares ? 'border-destructive ring-1 ring-destructive' : ''}`}
              />
              {validationErrors.hectares && (
                <p className="text-xs text-destructive mt-1">{validationErrors.hectares}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Geo-tagged Location <span className="text-destructive">*</span>
              </label>
              
              {location ? (
                <div className="space-y-3">
                  {/* Map Preview */}
                  <div className="relative h-32 rounded-xl overflow-hidden bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-destructive mx-auto mb-1" />
                        <p className="text-xs text-foreground font-medium">{location.address}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMapOpen(true);
                      if (validationErrors.location) setValidationErrors(prev => ({ ...prev, location: undefined }));
                    }}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Location</span>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setIsMapOpen(true);
                      if (validationErrors.location) setValidationErrors(prev => ({ ...prev, location: undefined }));
                    }}
                    className={`btn-secondary flex items-center justify-center gap-2 ${validationErrors.location ? 'border-destructive' : ''}`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Select Location</span>
                  </button>
                  {validationErrors.location && (
                    <p className="text-xs text-destructive mt-1">{validationErrors.location}</p>
                  )}
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-border flex flex-col items-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-xs font-medium">Add Photos</span>
                </button>
              </div>
              <div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-border flex flex-col items-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-xs font-medium">Add Video</span>
                </button>
              </div>
            </div>

            {/* Photo Previews */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Video Preview */}
            {video && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <Video className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground flex-1 truncate">{video.name}</span>
                <button onClick={() => setVideo(null)} className="text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button onClick={handleSubmit} className="btn-primary flex items-center justify-center gap-2 mt-2">
              <Upload className="w-5 h-5" />
              <span>Submit Project</span>
            </button>
          </div>
        </motion.div>

        {/* Past Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">📂</span>
            Past Submissions
          </h2>

          <div className="space-y-3">
            {pastSubmissions.map((project) => (
              <div key={project.id} className="card-elevated p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{project.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {project.hectares} hectares • {project.date}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    project.status === 'verified' 
                      ? 'bg-success-light text-success' 
                      : project.status === 'under-review'
                      ? 'bg-warning-light text-warning-foreground'
                      : 'bg-info-light text-info'
                  }`}>
                    {project.status === 'verified' && <Check className="w-3 h-3" />}
                    {project.status === 'under-review' && <Clock className="w-3 h-3" />}
                    <span className="capitalize">{project.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <MapModal
            onClose={() => setIsMapOpen(false)}
            onSelectLocation={handleLocationSelect}
            initialLocation={location}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeneratorScreen;
