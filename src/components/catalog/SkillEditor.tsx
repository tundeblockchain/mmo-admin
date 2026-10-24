import type { FieldErrors } from '../../lib/catalogValidation';
import type { SkillDefinition } from '../../types/catalog';
import { CatalogEditorLayout } from '../form';
import { SkillBasicSection } from './skill/SkillBasicSection';
import { SkillCoefficientsSection } from './skill/SkillCoefficientsSection';
import { SkillIdentitySection } from './skill/SkillIdentitySection';
import { SkillPvpSection } from './skill/SkillPvpSection';
import { SkillResourceEffectsSection } from './skill/SkillResourceEffectsSection';
import { SkillStaggerSection } from './skill/SkillStaggerSection';
import { SkillTimingSection } from './skill/SkillTimingSection';

interface SkillEditorProps {
  skillData: SkillDefinition;
  onUpdate: (updated: SkillDefinition) => void;
  idError?: string | null;
  fieldErrors?: FieldErrors;
}

export function SkillEditor({
  skillData,
  onUpdate,
  idError = null,
  fieldErrors = {},
}: SkillEditorProps) {
  return (
    <CatalogEditorLayout
      title="Skill Editor"
      description="Edit skill properties. Percentages are displayed as whole numbers but stored as decimals in the API."
    >
      <SkillIdentitySection
        skillData={skillData}
        onUpdate={onUpdate}
        idError={idError}
        fieldErrors={fieldErrors}
      />
      <SkillBasicSection skillData={skillData} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <SkillResourceEffectsSection
        skillData={skillData}
        onUpdate={onUpdate}
        fieldErrors={fieldErrors}
      />
      <SkillCoefficientsSection
        skillData={skillData}
        onUpdate={onUpdate}
        fieldErrors={fieldErrors}
      />
      <SkillTimingSection skillData={skillData} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <SkillStaggerSection skillData={skillData} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <SkillPvpSection skillData={skillData} onUpdate={onUpdate} fieldErrors={fieldErrors} />
    </CatalogEditorLayout>
  );
}
