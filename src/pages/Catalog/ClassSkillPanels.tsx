import { ClassDetail } from '../../components/catalog/ClassDetail';
import { ClassEditor } from '../../components/catalog/ClassEditor';
import { ClassList } from '../../components/catalog/ClassList';
import { CatalogSplitPane } from '../../components/catalog/CatalogSplitPane';
import { SkillDetail } from '../../components/catalog/SkillDetail';
import { SkillEditor } from '../../components/catalog/SkillEditor';
import { SkillList } from '../../components/catalog/SkillList';
import { collectEntityIds, getIdValidationMessage } from '../../lib/catalogIds';
import { getEntityFieldErrors } from '../../lib/catalogValidation';
import type { ClassDefinition, SkillDefinition } from '../../types/catalog';
import { selectByIndexOrId } from './catalogPageUtils';
import { draftListProps, type CatalogWorkspace } from './panelShared';

export function ClassCatalogPanel({ workspace }: { workspace: CatalogWorkspace }) {
  const { draft, classQuery, selectedIndex, selectedEntityId, currentVersion } = workspace;
  const classes = draft ? (draft.data as ClassDefinition[]) : classQuery.data?.data;
  const selected = selectByIndexOrId(classes, selectedIndex, selectedEntityId, (item) => item.classId);
  const idError =
    draft && selected
      ? getIdValidationMessage(selected.classId, collectEntityIds(classes ?? [], 'class'))
      : null;
  const listProps = draftListProps(workspace);

  if (draft && selected) {
    return (
      <CatalogSplitPane
        list={
          <ClassList
            classes={classes}
            selectedClassId={selectedEntityId}
            onSelectClass={workspace.handleSelectEntity}
            isLoading={false}
            error={null}
            {...listProps}
          />
        }
        detail={
          <ClassEditor
            classData={selected}
            onUpdate={workspace.draftActions.handleUpdateClassEntity}
            idError={idError}
            fieldErrors={getEntityFieldErrors(selected, 'class')}
          />
        }
      />
    );
  }

  return (
    <CatalogSplitPane
      list={
        <ClassList
          classes={classes}
          selectedClassId={selectedEntityId}
          selectedIndex={selectedIndex}
          onSelectClass={workspace.handleSelectEntity}
          isLoading={classQuery.isPending && currentVersion !== null && !draft}
          error={classQuery.error}
          {...listProps}
        />
      }
      detail={<ClassDetail classData={selected} />}
    />
  );
}

export function SkillCatalogPanel({ workspace }: { workspace: CatalogWorkspace }) {
  const { draft, skillQuery, selectedIndex, selectedEntityId, currentVersion } = workspace;
  const skills = draft ? (draft.data as SkillDefinition[]) : skillQuery.data?.data;
  const selected = selectByIndexOrId(skills, selectedIndex, selectedEntityId, (item) => item.skillId);
  const idError =
    draft && selected
      ? getIdValidationMessage(selected.skillId, collectEntityIds(skills ?? [], 'skill'))
      : null;
  const listProps = draftListProps(workspace);

  if (draft && selected) {
    return (
      <CatalogSplitPane
        list={
          <SkillList
            skills={skills}
            selectedSkillId={selectedEntityId}
            onSelectSkill={workspace.handleSelectEntity}
            isLoading={false}
            error={null}
            {...listProps}
          />
        }
        detail={
          <SkillEditor
            skillData={selected}
            onUpdate={workspace.draftActions.handleUpdateSkillEntity}
            idError={idError}
            fieldErrors={getEntityFieldErrors(selected, 'skill')}
          />
        }
      />
    );
  }

  return (
    <CatalogSplitPane
      list={
        <SkillList
          skills={skills}
          selectedSkillId={selectedEntityId}
          selectedIndex={selectedIndex}
          onSelectSkill={workspace.handleSelectEntity}
          isLoading={skillQuery.isPending && currentVersion !== null && !draft}
          error={draft ? null : skillQuery.error}
          {...listProps}
        />
      }
      detail={<SkillDetail skillData={selected} />}
    />
  );
}
