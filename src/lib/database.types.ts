export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type DoshaType = 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';
export type UserRole = 'patient' | 'hospital' | 'doctor';
export type AppointmentType = 'in-person' | 'video';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          dosha: DoshaType | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          phone?: string | null;
          dosha?: DoshaType | null;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Update: {
          name?: string | null;
          phone?: string | null;
          dosha?: DoshaType | null;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      hospitals: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          tagline: string | null;
          description: string | null;
          location: string | null;
          city: string | null;
          state: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          rating: number;
          review_count: number;
          verified: boolean;
          year_established: number | null;
          accreditations: string[];
          amenities: string[];
          created_at: string;
        };
        Insert: {
          owner_id?: string | null;
          name: string;
          tagline?: string | null;
          description?: string | null;
          location?: string | null;
          city?: string | null;
          state?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          year_established?: number | null;
          accreditations?: string[];
          amenities?: string[];
        };
        Update: {
          owner_id?: string | null;
          name?: string;
          tagline?: string | null;
          description?: string | null;
          location?: string | null;
          city?: string | null;
          state?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          year_established?: number | null;
          accreditations?: string[];
          amenities?: string[];
        };
        Relationships: [];
      };
      specialities: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
        };
        Insert: {
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      doctors: {
        Row: {
          id: string;
          hospital_id: string | null;
          profile_id: string | null;
          name: string;
          photo_url: string | null;
          title: string | null;
          bio: string | null;
          experience: number;
          education: string[];
          languages: string[];
          rating: number;
          review_count: number;
          consultation_fee: number;
          video_fee: number;
          available_days: string[];
          next_available: string | null;
          accepts_video: boolean;
          dosha_expertise: string[];
          created_at: string;
        };
        Insert: {
          hospital_id?: string | null;
          profile_id?: string | null;
          name: string;
          photo_url?: string | null;
          title?: string | null;
          bio?: string | null;
          experience?: number;
          education?: string[];
          languages?: string[];
          consultation_fee?: number;
          video_fee?: number;
          available_days?: string[];
          next_available?: string | null;
          accepts_video?: boolean;
          dosha_expertise?: string[];
        };
        Update: {
          hospital_id?: string | null;
          profile_id?: string | null;
          name?: string;
          photo_url?: string | null;
          title?: string | null;
          bio?: string | null;
          experience?: number;
          education?: string[];
          languages?: string[];
          consultation_fee?: number;
          video_fee?: number;
          available_days?: string[];
          next_available?: string | null;
          accepts_video?: boolean;
          dosha_expertise?: string[];
        };
        Relationships: [];
      };
      doctor_specialities: {
        Row: { doctor_id: string; speciality_id: string };
        Insert: { doctor_id: string; speciality_id: string };
        Update: { doctor_id?: string; speciality_id?: string };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string | null;
          hospital_id: string | null;
          date: string;
          time: string;
          type: AppointmentType;
          status: AppointmentStatus;
          notes: string | null;
          follow_up_date: string | null;
          prescription: string | null;
          meeting_link: string | null;
          fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          patient_id: string;
          doctor_id?: string | null;
          hospital_id?: string | null;
          date: string;
          time: string;
          type: AppointmentType;
          status?: AppointmentStatus;
          notes?: string | null;
          fee?: number;
          meeting_link?: string | null;
        };
        Update: {
          status?: AppointmentStatus;
          notes?: string | null;
          follow_up_date?: string | null;
          prescription?: string | null;
          meeting_link?: string | null;
        };
        Relationships: [];
      };
      dosha_assessments: {
        Row: {
          id: string;
          patient_id: string;
          dominant_dosha: 'vata' | 'pitta' | 'kapha';
          vata_score: number;
          pitta_score: number;
          kapha_score: number;
          answers: Json | null;
          taken_at: string;
        };
        Insert: {
          patient_id: string;
          dominant_dosha: 'vata' | 'pitta' | 'kapha';
          vata_score?: number;
          pitta_score?: number;
          kapha_score?: number;
          answers?: Json | null;
        };
        Update: {
          dominant_dosha?: 'vata' | 'pitta' | 'kapha';
          vata_score?: number;
          pitta_score?: number;
          kapha_score?: number;
          answers?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type Profile        = Database['public']['Tables']['profiles']['Row'];
export type Hospital       = Database['public']['Tables']['hospitals']['Row'];
export type Speciality     = Database['public']['Tables']['specialities']['Row'];
export type Doctor         = Database['public']['Tables']['doctors']['Row'];
export type Appointment    = Database['public']['Tables']['appointments']['Row'];
export type DoshaAssessment = Database['public']['Tables']['dosha_assessments']['Row'];

// Doctor with joined specialities and hospital name
export type DoctorWithRelations = Doctor & {
  hospital_name?: string;
  speciality_names?: string[];
};

// Appointment with joined doctor and hospital names
export type AppointmentWithRelations = Appointment & {
  doctor_name?: string;
  doctor_photo?: string;
  hospital_name?: string;
};
