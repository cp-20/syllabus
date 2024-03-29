import { relations } from 'drizzle-orm';
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
  index,
} from 'drizzle-orm/sqlite-core';

export const lectures = sqliteTable(
  'lectures',
  {
    id: integer('id').notNull().primaryKey({ autoIncrement: true }),
    url: text('url').notNull().unique(),
    title: text('title').notNull(),
    origin: text('origin').notNull(),
    placeType: text('place_type').notNull(),
    placeValue: text('place_value'),
    codeGrade: text('code_grade').notNull(),
    codeValue: text('code_value').notNull(),
    credit: integer('credit').notNull(),
    year: text('year').notNull(),
    quarter: text('quarter').notNull(),
    language: text('language').notNull(),
  },
  (t) => ({
    placeIndex: index('place_idx').on(t.placeType, t.placeValue),
    yearIndex: index('year_idx').on(t.year),
    languageIndex: index('language_idx').on(t.language),
  })
);

export const lecturesRelation = relations(lectures, ({ many }) => ({
  teachers: many(teachers),
  periods: many(lecturePeriods),
}));

export const lecturePeriods = sqliteTable(
  'lecture_periods',
  {
    lectureId: integer('lecture_id')
      .notNull()
      .references(() => lectures.id),
    classroom: text('classroom'),
    period: text('period').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.lectureId, t.period] }),
    timeIndex: index('period_idx').on(t.period),
  })
);

export const lecturePeriodsRelation = relations(lecturePeriods, ({ one }) => ({
  lecture: one(lectures),
}));

export const teachers = sqliteTable('teachers', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  url: text('url').notNull(),
});

export const teachersRelation = relations(teachers, ({ many }) => ({
  lectures: many(lectures),
}));

export const teacherAssignment = sqliteTable(
  'teacher_assignment',
  {
    lectureId: integer('lecture_id')
      .notNull()
      .references(() => lectures.id),
    teacherId: integer('teacher_id')
      .notNull()
      .references(() => teachers.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.lectureId, t.teacherId] }),
  })
);