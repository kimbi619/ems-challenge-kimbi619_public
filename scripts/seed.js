import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { hash } from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const roles = [
  { name: 'admin' },
  { name: 'engineering' },
  { name: 'finance' },
  { name: 'hr' },
  { name: 'marketing' },
];

const employees = [
  {
    first_name: 'Blaise',
    last_name: 'Nkouangang',
    email: 'blaise.nkouangang@company.cm',
    phone: '+237 691 234 567',
    role_id: 1,
    hire_date: '2021-03-15',
    job_title: 'Software Engineer',
    department: 'Engineering',
    avatar_url: 'storage/avatars/blaise_nkouangang.jpg',
    last_login: '2025-02-10 08:45:00',
    manager_id: null,
    date_of_birth: '1990-06-22',
    initial_salary: 450000,
    current_salary: 620000,
    start_date: '2021-03-15',
    end_date: null,
    identification_number: 'CM-ID-10023456',
    id_document_url: 'storage/documents/ids/blaise_nkouangang_id.pdf',
    cv_url: 'storage/documents/cvs/blaise_nkouangang_cv.pdf',
    password_hash: await hash('helloworld', 12),
  },
  {
    first_name: 'Mireille',
    last_name: 'Tchamba',
    email: 'mireille.tchamba@company.cm',
    phone: '+237 677 891 234',
    role_id: 4,
    hire_date: '2020-07-01',
    job_title: 'HR Manager',
    department: 'Human Resources',
    avatar_url: 'storage/avatars/mireille_tchamba.jpg',
    last_login: '2025-02-11 09:10:00',
    manager_id: 1,
    date_of_birth: '1985-11-14',
    initial_salary: 500000,
    current_salary: 700000,
    start_date: '2020-07-01',
    end_date: null,
    identification_number: 'CM-ID-20034567',
    id_document_url: 'storage/documents/ids/mireille_tchamba_id.pdf',
    cv_url: 'storage/documents/cvs/mireille_tchamba_cv.pdf',
    password_hash: await hash('helloworld', 12),
  },
  {
    first_name: 'Rodrigue',
    last_name: 'Essomba',
    email: 'rodrigue.essomba@company.cm',
    phone: '+237 655 456 789',
    role_id: 3,
    hire_date: '2022-01-10',
    job_title: 'Accountant',
    department: 'Finance',
    avatar_url: 'storage/avatars/rodrigue_essomba.jpg',
    last_login: '2025-02-09 07:55:00',
    manager_id: 1,
    date_of_birth: '1993-03-30',
    initial_salary: 380000,
    current_salary: 470000,
    start_date: '2022-01-10',
    end_date: null,
    identification_number: 'CM-ID-30045678',
    id_document_url: 'storage/documents/ids/rodrigue_essomba_id.pdf',
    cv_url: 'storage/documents/cvs/rodrigue_essomba_cv.pdf',
    password_hash: await hash('helloworld', 12),
  },
  {
    first_name: 'Aïssatou',
    last_name: 'Ngah',
    email: 'aissatou.ngah@company.cm',
    phone: '+237 699 321 654',
    role_id: 5,
    hire_date: '2019-09-05',
    job_title: 'Marketing Lead',
    department: 'Marketing',
    avatar_url: 'storage/avatars/aissatou_ngah.jpg',
    last_login: '2025-02-12 08:30:00',
    manager_id: 1,
    date_of_birth: '1988-08-19',
    initial_salary: 420000,
    current_salary: 590000,
    start_date: '2019-09-05',
    end_date: null,
    identification_number: 'CM-ID-40056789',
    id_document_url: 'storage/documents/ids/aissatou_ngah_id.pdf',
    cv_url: 'storage/documents/cvs/aissatou_ngah_cv.pdf',
    password_hash: await hash('helloworld', 12),
  },
  {
    first_name: 'Hervé',
    last_name: 'Mbianda',
    email: 'herve.mbianda@company.cm',
    phone: '+237 670 987 123',
    role_id: 2,
    hire_date: '2023-05-20',
    job_title: 'Junior Developer',
    department: 'Engineering',
    avatar_url: 'storage/avatars/herve_mbianda.jpg',
    last_login: '2025-02-10 09:00:00',
    manager_id: 1,
    date_of_birth: '1998-01-07',
    initial_salary: 300000,
    current_salary: 340000,
    start_date: '2023-05-20',
    end_date: null,
    identification_number: 'CM-ID-50067890',
    id_document_url: 'storage/documents/ids/herve_mbianda_id.pdf',
    cv_url: 'storage/documents/cvs/herve_mbianda_cv.pdf',
    password_hash: await hash('helloworld', 12),
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
    break_duration: 60,
    break_start_time: '2025-02-10 12:00:00',
    break_end_time: '2025-02-10 13:00:00',
    check_in_location: '3.8480,11.5021',
    check_out_location: '3.8480,11.5021',
    check_in_device: 'badge-reader-01',
    check_out_device: 'badge-reader-01',
    break_pause_location: '3.8480,11.5021',
    break_resume_location: '3.8480,11.5021',
    break_pause_device: 'mobile-app',
    break_resume_device: 'mobile-app',
    is_remote: 0,
    is_regularized: 0,
    regularization_reason: null,
    regularization_requested_at: null,
    regularization_request_approved_at: null,
    regularization_request_approved_by: null,
    is_absence: 0,
    absence_reason: null,
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 08:30:00',
    end_time: '2025-02-11 17:30:00',
    break_duration: 45,
    break_start_time: '2025-02-11 12:15:00',
    break_end_time: '2025-02-11 13:00:00',
    check_in_location: '3.8480,11.5021',
    check_out_location: '3.8480,11.5021',
    check_in_device: 'badge-reader-01',
    check_out_device: 'badge-reader-01',
    break_pause_location: '3.8480,11.5021',
    break_resume_location: '3.8480,11.5021',
    break_pause_device: 'mobile-app',
    break_resume_device: 'mobile-app',
    is_remote: 0,
    is_regularized: 1,
    regularization_reason: 'Forgot to clock in on time',
    regularization_requested_at: '2025-02-11 18:00:00',
    regularization_request_approved_at: '2025-02-12 09:00:00',
    regularization_request_approved_by: 1,
    is_absence: 0,
    absence_reason: null,
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
    break_duration: 60,
    break_start_time: '2025-02-12 11:30:00',
    break_end_time: '2025-02-12 12:30:00',
    check_in_location: '4.0511,9.7679', 
    check_out_location: '4.0511,9.7679',
    check_in_device: 'badge-reader-02',
    check_out_device: 'badge-reader-02',
    break_pause_location: '4.0511,9.7679',
    break_resume_location: '4.0511,9.7679',
    break_pause_device: 'tablet-kiosk',
    break_resume_device: 'tablet-kiosk',
    is_remote: 0,
    is_regularized: 0,
    regularization_reason: null,
    regularization_requested_at: null,
    regularization_request_approved_at: null,
    regularization_request_approved_by: null,
    is_absence: 0,
    absence_reason: null,
  },
  {
    employee_id: 4,
    start_time: '2025-02-12 09:00:00',
    end_time: '2025-02-12 09:00:00',   
    break_duration: 0,
    break_start_time: '2025-02-12 09:00:00',
    break_end_time: '2025-02-12 09:00:00',
    check_in_location: '0.0000,0.0000',
    check_out_location: '0.0000,0.0000',
    check_in_device: 'none',
    check_out_device: 'none',
    break_pause_location: '0.0000,0.0000',
    break_resume_location: '0.0000,0.0000',
    break_pause_device: 'none',
    break_resume_device: 'none',
    is_remote: 0,
    is_regularized: 0,
    regularization_reason: null,
    regularization_requested_at: null,
    regularization_request_approved_at: null,
    regularization_request_approved_by: null,
    is_absence: 1,
    absence_reason: 'Medical appointment',
  },
  {
    employee_id: 5,
    start_time: '2025-02-13 08:00:00',
    end_time: '2025-02-13 17:00:00',
    break_duration: 60,
    break_start_time: '2025-02-13 12:00:00',
    break_end_time: '2025-02-13 13:00:00',
    check_in_location: '3.8480,11.5021',
    check_out_location: '3.8480,11.5021',
    check_in_device: 'mobile-app',
    check_out_device: 'mobile-app',
    break_pause_location: '3.8480,11.5021',
    break_resume_location: '3.8480,11.5021',
    break_pause_device: 'mobile-app',
    break_resume_device: 'mobile-app',
    is_remote: 1,
    is_regularized: 0,
    regularization_reason: null,
    regularization_requested_at: null,
    regularization_request_approved_at: null,
    regularization_request_approved_by: null,
    is_absence: 0,
    absence_reason: null,
  },
];



const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('roles', roles);
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

