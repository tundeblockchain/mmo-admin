import type { FieldErrors } from '../../lib/catalogValidation';
import type { CombatConstantsData } from '../../types/catalog';
import { CatalogEditorLayout } from '../form';
import { AdditionalConstantsSection } from './combat/AdditionalConstantsSection';
import { StatAllocationBandsSection } from './combat/BandsAndConstantsSection';
import { CapsDodgeSections } from './combat/CapsTimingPvpSections';
import { CriticalSection, DefenseSection } from './combat/CriticalDefenseSection';
import { SpeedVitalitySections } from './combat/OptionalCombatSections';
import { AccuracyGlancingStatusSections } from './combat/AccuracyGlancingStatusSections';
import { PowerScalingSection } from './combat/PowerScalingSection';
import { TimingStaggerPvpSections } from './combat/TimingStaggerPvpSections';

interface CombatConstantsEditorProps {
  data: CombatConstantsData;
  onUpdate: (updated: CombatConstantsData) => void;
  fieldErrors?: FieldErrors;
}

export function CombatConstantsEditor({
  data,
  onUpdate,
  fieldErrors = {},
}: CombatConstantsEditorProps) {
  return (
    <CatalogEditorLayout
      title="Combat Constants Editor"
      description="Edit combat math constants. Percentages are displayed as whole numbers (e.g., 50 = 50%) but stored as decimals (0.50) in the API."
    >
      <PowerScalingSection data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <CriticalSection data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <DefenseSection data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <SpeedVitalitySections data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <AccuracyGlancingStatusSections data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <CapsDodgeSections data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <TimingStaggerPvpSections data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <StatAllocationBandsSection data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
      <AdditionalConstantsSection data={data} onUpdate={onUpdate} fieldErrors={fieldErrors} />
    </CatalogEditorLayout>
  );
}
