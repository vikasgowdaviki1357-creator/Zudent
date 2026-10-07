import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import Event from '../models/Event.js';
import Resource from '../models/Resource.js';
import Announcement from '../models/Announcement.js';
import MarketplaceItem from '../models/MarketplaceItem.js';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/jit_super_app';

const seedDatabase = async () => {
  try {
    // ==================================================
    // CONNECT TO MONGODB
    // ==================================================

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connected for Seeding');

    // ==================================================
    // CLEAR EXISTING DATA
    // ==================================================

    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Event.deleteMany({});
    await Resource.deleteMany({});
    await Announcement.deleteMany({});
    await MarketplaceItem.deleteMany({});

    console.log('Collections cleared.');

    // ==================================================
    // ADMIN
    // ==================================================
    //
    // IMPORTANT:
    // User.create() triggers the User pre-save hook,
    // so the password will be bcrypt hashed.
    //

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@jit.edu',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin created:', admin.email);

    // ==================================================
    // HOD
    // ==================================================

    const hod = await User.create({
      name: 'HOD CSE',
      email: 'hod.cse@jit.edu',
      password: 'hod123',
      role: 'hod',
      department: 'CSE',
      designation: 'Head of Department',
    });

    console.log('HOD created:', hod.email);

    // ==================================================
    // FACULTY
    // ==================================================
    //
    // DO NOT use insertMany() here.
    // User.create() ensures password hashing happens.
    //

    const facultyList = await Promise.all([
      User.create({
        name: 'Dr. Ramesh',
        email: 'ramesh@jit.edu',
        password: 'password123',
        role: 'faculty',
        department: 'CSE',
      }),

      User.create({
        name: 'Prof. Anjali',
        email: 'anjali@jit.edu',
        password: 'password123',
        role: 'faculty',
        department: 'CSE',
      }),

      User.create({
        name: 'Dr. Suresh',
        email: 'suresh@jit.edu',
        password: 'password123',
        role: 'faculty',
        department: 'ISE',
      }),
    ]);

    console.log('Faculty accounts created.');

    // ==================================================
    // STUDENTS
    // ==================================================
    //
    // Student login accounts:
    //
    // student1@jit.edu
    // student2@jit.edu
    // ...
    // student20@jit.edu
    //
    // Password for ALL students:
    //
    // student123
    //
    // Example:
    //
    // Email: student1@jit.edu
    // Password: student123
    //
    // User.create() is intentionally used so the
    // pre-save bcrypt hashing middleware runs.
    //

    const studentUsers = [];

    for (let i = 1; i <= 20; i++) {
      const usnNum = i.toString().padStart(3, '0');

      const student = await User.create({
        name: `Student ${i}`,

        email: `student${i}@jit.edu`,

        password: 'student123',

        role: 'student',

        usn: `1JT22CS${usnNum}`,

        branch: 'CSE',

        semester: 3,

        admissionYear: 2022,
      });

      studentUsers.push(student);
    }

    console.log('20 student accounts created.');

    // ==================================================
    // COURSES
    // ==================================================

    const courses = await Course.insertMany([
      {
        code: 'BCS301',
        name: 'Data Structures',
        branch: 'CSE',
        semester: 3,
        credits: 4,
        type: 'Theory',
        faculty: facultyList[0]._id,
      },

      {
        code: 'BCS302',
        name: 'Python Programming',
        branch: 'CSE',
        semester: 3,
        credits: 3,
        type: 'Theory',
        faculty: facultyList[1]._id,
      },

      {
        code: 'BCH101',
        name: 'Chemistry',
        branch: 'CSE',
        semester: 1,
        credits: 4,
        type: 'Theory',
        faculty: facultyList[2]._id,
      },
    ]);

    console.log('Courses created.');

    // ==================================================
    // ASSIGNMENTS
    // ==================================================

    await Assignment.insertMany([
      {
        title: 'Linked Lists implementation',
        course: courses[0]._id,
        faculty: facultyList[0]._id,
        dueDate: new Date(
          Date.now() + 86400000 * 5
        ),
      },

      {
        title: 'Tree traversals',
        course: courses[0]._id,
        faculty: facultyList[0]._id,
        dueDate: new Date(
          Date.now() + 86400000 * 10
        ),
      },

      {
        title: 'Python List Comprehensions',
        course: courses[1]._id,
        faculty: facultyList[1]._id,
        dueDate: new Date(
          Date.now() + 86400000 * 3
        ),
      },

      {
        title: 'Data Analysis with Pandas',
        course: courses[1]._id,
        faculty: facultyList[1]._id,
        dueDate: new Date(
          Date.now() + 86400000 * 7
        ),
      },

      {
        title: 'Chemistry Lab Report',
        course: courses[2]._id,
        faculty: facultyList[2]._id,
        dueDate: new Date(
          Date.now() + 86400000 * 2
        ),
      },
    ]);

    console.log('Assignments created.');

    // ==================================================
    // EVENTS
    // ==================================================

    await Event.insertMany([
      {
        title: 'Tech Symposium 2024',
        category: 'Technical',
        date: new Date(
          Date.now() + 86400000 * 15
        ),
        venue: 'Main Auditorium',
        organizer: 'Tech Club',
      },

      {
        title: 'Cultural Fest',
        category: 'Cultural',
        date: new Date(
          Date.now() + 86400000 * 30
        ),
        venue: 'College Grounds',
        organizer: 'Cultural Committee',
      },

      {
        title: 'Inter-Department Cricket',
        category: 'Sports',
        date: new Date(
          Date.now() + 86400000 * 10
        ),
        venue: 'Sports Field',
        organizer: 'Sports Dept',
      },

      {
        title: 'AI Workshop',
        category: 'Workshop',
        date: new Date(
          Date.now() + 86400000 * 5
        ),
        venue: 'Lab 3',
        organizer: 'CSE Dept',
      },

      {
        title: 'Industry Trends Seminar',
        category: 'Seminar',
        date: new Date(
          Date.now() + 86400000 * 8
        ),
        venue: 'Seminar Hall',
        organizer: 'Placement Cell',
      },
    ]);

    console.log('Events created.');

    // ==================================================
    // RESOURCES
    // ==================================================

    await Resource.insertMany([
      {
        title: 'Module 1 Notes',
        type: 'Notes',
        subject: 'Data Structures',
        branch: 'CSE',
        semester: 3,
        uploadedBy: facultyList[0]._id,
        isApproved: true,
      },

      {
        title: '2022 Question Paper',
        type: 'Question Papers',
        subject: 'Python',
        branch: 'CSE',
        semester: 3,
        uploadedBy: studentUsers[0]._id,
        isApproved: true,
      },

      {
        title: 'Lab Manual v2',
        type: 'Lab Manuals',
        subject: 'Chemistry',
        branch: 'CSE',
        semester: 1,
        uploadedBy: facultyList[2]._id,
        isApproved: true,
      },

      {
        title: 'Important Questions Mod 2',
        type: 'Important Questions',
        subject: 'Data Structures',
        branch: 'CSE',
        semester: 3,
        uploadedBy: facultyList[0]._id,
        isApproved: true,
      },

      {
        title: 'Cheatsheet',
        type: 'Notes',
        subject: 'Python',
        branch: 'CSE',
        semester: 3,
        uploadedBy: studentUsers[1]._id,
        isApproved: false,
      },
    ]);

    console.log('Resources created.');

    // ==================================================
    // ANNOUNCEMENTS
    // ==================================================

    await Announcement.insertMany([
  {
    title: "Holiday Declaration",
    description: "College will remain closed tomorrow.",
    audience: "All Users",
    department: "All Departments",
    priority: "Urgent",
    status: "Published",
    createdBy: admin._id,
  },

  {
    title: "Fee Payment Deadline",
    description: "The last date for fee payment is 15th.",
    audience: "Students",
    department: "All Departments",
    priority: "Urgent",
    status: "Published",
    createdBy: admin._id,
  },

  {
    title: "Hackathon Registration",
    description: "Register for the upcoming hackathon.",
    audience: "Students",
    department: "CSE",
    priority: "Important",
    status: "Published",
    createdBy: hod._id,
  },

  {
    title: "Library Books Return",
    description: "Please return all library books before the deadline.",
    audience: "Students",
    department: "All Departments",
    priority: "Normal",
    status: "Published",
    createdBy: admin._id,
  },

  {
    title: "Placement Drive",
    description: "Infosys placement drive will be conducted next week.",
    audience: "Students",
    department: "All Departments",
    priority: "Urgent",
    status: "Published",
    createdBy: admin._id,
  },
]);

    // ==================================================
    // COMPLETE
    // ==================================================

    console.log('');
    console.log('==========================================');
    console.log('       SEEDING COMPLETED SUCCESSFULLY');
    console.log('==========================================');
    console.log('');

    console.log('ADMIN');
    console.log('Email    : admin@jit.edu');
    console.log('Password : admin123');
    console.log('');

    console.log('HOD');
    console.log('Email    : hod.cse@jit.edu');
    console.log('Password : hod123');
    console.log('');

    console.log('FACULTY');
    console.log('Email    : ramesh@jit.edu');
    console.log('Password : password123');
    console.log('');

    console.log('STUDENT');
    console.log('Email    : student1@jit.edu');
    console.log('Password : student123');
    console.log('USN      : 1JT22CS001');
    console.log('');

    console.log('STUDENT 2');
    console.log('Email    : student2@jit.edu');
    console.log('Password : student123');
    console.log('USN      : 1JT22CS002');
    console.log('');

    console.log('==========================================');
    console.log(
      'Created 1 Admin, 1 HOD, 3 Faculty, 20 Students,'
    );
    console.log(
      '3 Courses, 5 Assignments, 5 Events, 5 Resources,'
    );
    console.log(
      '5 Announcements, 3 Marketplace Items.'
    );
    console.log('==========================================');

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('==========================================');
    console.error('           SEEDING ERROR');
    console.error('==========================================');
    console.error(error);
    console.error('==========================================');

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();