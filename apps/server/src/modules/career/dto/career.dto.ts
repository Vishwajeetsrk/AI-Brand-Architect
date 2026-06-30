import { IsString, IsOptional, IsArray, IsBoolean, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResumeDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty() @IsString() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headline?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedInUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() portfolioUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() githubUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) languages?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) certifications?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() templateStyle?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublic?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() sections?: { type: string; title: string; items: any; order?: number }[];
}

export class CreateJobDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() company: string;
  @ApiProperty() @IsString() location: string;
  @ApiProperty() @IsOptional() @IsString() companyLogo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() salaryMin?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() salaryMax?: number;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() responsibilities?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) requirements?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) preferredSkills?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) benefits?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() experienceLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() applicationUrl?: string;
}

export class CreateInterviewDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() companyName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() difficulty?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(120) duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(30) questionsCount?: number;
}

export class CreateSkillAssessmentDto {
  @ApiProperty() @IsString() skill: string;
  @ApiPropertyOptional() @IsOptional() @IsString() level?: string;
}

export class CreatePortfolioDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() avatarUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @ApiPropertyOptional() @IsOptional() socialLinks?: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublic?: boolean;
}

export class ApplyJobDto {
  @ApiPropertyOptional() @IsOptional() @IsString() resumeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() coverLetter?: string;
  @ApiPropertyOptional() @IsOptional() answers?: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) attachments?: string[];
}

export class SaveAnswerDto {
  @ApiProperty() @IsString() answer: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() timeTaken?: number;
}
