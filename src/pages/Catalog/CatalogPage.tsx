import { useState, useCallback } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { CatalogTypeNav } from '../../components/catalog/CatalogTypeNav';
import { VersionPicker } from '../../components/catalog/VersionPicker';
import { ClassList } from '../../components/catalog/ClassList';
import { ClassDetail } from '../../components/catalog/ClassDetail';
import { SkillList } from '../../components/catalog/SkillList';
import { SkillDetail } from '../../components/catalog/SkillDetail';
import { StatusList } from '../../components/catalog/StatusList';
import { StatusDetail } from '../../components/catalog/StatusDetail';
import { ElementList } from '../../components/catalog/ElementList';
import { ElementDetail } from '../../components/catalog/ElementDetail';
import { ResonanceList } from '../../components/catalog/ResonanceList';
import { ResonanceDetail } from '../../components/catalog/ResonanceDetail';
import { CombatConstantsDetail } from '../../components/catalog/CombatConstantsDetail';
import { useCatalogVersions } from '../../hooks/useCatalogVersions';
import {
  useClassCatalog,
  useSkillCatalog,
  useStatusCatalog,
  useElementCatalog,
  useResonanceCatalog,
  useCombatConstantsCatalog,
} from '../../hooks/useCatalogData';
import type { CatalogType } from '../../types/catalog';

interface VersionSelections {
  class: number | null;
  skill: number | null;
  'combat-constants': number | null;
  status: number | null;
  element: number | null;
  resonance: number | null;
}

export function CatalogPage() {
  const [selectedType, setSelectedType] = useState<CatalogType>('class');
  const [versions, setVersions] = useState<VersionSelections>({
    class: null,
    skill: null,
    'combat-constants': null,
    status: null,
    element: null,
    resonance: null,
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const {
    data: versionData,
    isPending: versionsLoading,
    error: versionsError,
  } = useCatalogVersions();

  const classQuery = useClassCatalog(versions.class);
  const skillQuery = useSkillCatalog(versions.skill);
  const statusQuery = useStatusCatalog(versions.status);
  const elementQuery = useElementCatalog(versions.element);
  const resonanceQuery = useResonanceCatalog(versions.resonance);
  const combatConstantsQuery = useCombatConstantsCatalog(versions['combat-constants']);

  const handleTypeChange = useCallback((type: CatalogType) => {
    setSelectedType(type);
    setSelectedEntityId(null);
  }, []);

  const handleVersionChange = useCallback((type: CatalogType, version: number) => {
    setVersions((prev) => ({ ...prev, [type]: version }));
    setSelectedEntityId(null);
  }, []);

  const handleSelectEntity = useCallback((id: string) => {
    setSelectedEntityId(id);
  }, []);

  const allVersions = versionData?.versions ?? [];
  const currentVersion = versions[selectedType];

  const renderEntityContent = () => {
    switch (selectedType) {
      case 'class': {
        const classes = classQuery.data?.data;
        const selectedClass = classes?.find((c) => c.classId === selectedEntityId) ?? null;
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <ClassList
                  classes={classes}
                  selectedClassId={selectedEntityId}
                  onSelectClass={handleSelectEntity}
                  isLoading={classQuery.isPending && currentVersion !== null}
                  error={classQuery.error}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ClassDetail classData={selectedClass} />
            </Grid>
          </Grid>
        );
      }

      case 'skill': {
        const skills = skillQuery.data?.data;
        const selectedSkill = skills?.find((s) => s.skillId === selectedEntityId) ?? null;
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <SkillList
                  skills={skills}
                  selectedSkillId={selectedEntityId}
                  onSelectSkill={handleSelectEntity}
                  isLoading={skillQuery.isPending && currentVersion !== null}
                  error={skillQuery.error}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <SkillDetail skillData={selectedSkill} />
            </Grid>
          </Grid>
        );
      }

      case 'status': {
        const statuses = statusQuery.data?.data;
        const selectedStatus = statuses?.find((s) => s.statusId === selectedEntityId) ?? null;
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <StatusList
                  statuses={statuses}
                  selectedStatusId={selectedEntityId}
                  onSelectStatus={handleSelectEntity}
                  isLoading={statusQuery.isPending && currentVersion !== null}
                  error={statusQuery.error}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <StatusDetail statusData={selectedStatus} />
            </Grid>
          </Grid>
        );
      }

      case 'element': {
        const elements = elementQuery.data?.data;
        const selectedElement = elements?.find((e) => e.elementId === selectedEntityId) ?? null;
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <ElementList
                  elements={elements}
                  selectedElementId={selectedEntityId}
                  onSelectElement={handleSelectEntity}
                  isLoading={elementQuery.isPending && currentVersion !== null}
                  error={elementQuery.error}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ElementDetail elementData={selectedElement} />
            </Grid>
          </Grid>
        );
      }

      case 'resonance': {
        const resonances = resonanceQuery.data?.data;
        const selectedResonance = resonances?.find((r) => r.resonanceId === selectedEntityId) ?? null;
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                <ResonanceList
                  resonances={resonances}
                  selectedResonanceId={selectedEntityId}
                  onSelectResonance={handleSelectEntity}
                  isLoading={resonanceQuery.isPending && currentVersion !== null}
                  error={resonanceQuery.error}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <ResonanceDetail resonanceData={selectedResonance} />
            </Grid>
          </Grid>
        );
      }

      case 'combat-constants': {
        return (
          <CombatConstantsDetail
            data={combatConstantsQuery.data?.data}
            isLoading={combatConstantsQuery.isPending && currentVersion !== null}
            error={combatConstantsQuery.error}
          />
        );
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Catalog
      </Typography>

      <CatalogTypeNav selectedType={selectedType} onTypeChange={handleTypeChange} />

      <Box sx={{ mb: 3 }}>
        <VersionPicker
          catalogType={selectedType}
          versions={allVersions}
          selectedVersion={currentVersion}
          onVersionChange={(version) => handleVersionChange(selectedType, version)}
          isLoading={versionsLoading}
          error={versionsError}
        />
        {currentVersion !== null && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            Viewing version {currentVersion}
          </Typography>
        )}
      </Box>

      {currentVersion === null ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Select a version above to browse catalog entities.
          </Typography>
        </Paper>
      ) : (
        renderEntityContent()
      )}
    </Box>
  );
}
