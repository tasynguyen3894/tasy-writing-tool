<template>
  <div>
    <div v-if="props.label">
      <div class="text-h6">{{ props.label }}</div>
    </div>
    <div>
      <q-btn icon="add" @click="startToEdit()" />
      <q-btn-group :key="index" v-for="(group, index) in props.toolbars">
        <template :key="toolbar" v-for="toolbar in group">
          <q-btn v-bind="btnBind(toolbar)" @click="format(toolbar)" />
        </template>
      </q-btn-group>
      <div>
        <q-chip
          v-for="variable in savedVariables"
          :key="variable.key"
          removable
          clickable
          @click="addSavedVariable(variable.key)"
          @remove="removeSavedVariable(variable.key)"
          flat
        >{{ variable.label }}</q-chip>
      </div>
    </div>
    
    <div
      ref="editorRawRef"
      @input="changeHtml"
      @paste="handlePaste"
      class="editor"
      contenteditable="true">
    </div>
  </div>
  <q-dialog v-model="isShowCharacter">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add variable info</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          v-model="variableType"
          :options="[VariableType.character, VariableType.object]"
          label="Variable type"
        />
        <q-select
          v-model="variableSelected"
          :options="variableType === VariableType.character ? props.characters : props.objects"
          label="Character"
          option-label="name"
        />
        <template v-if="variableSelected">
          <q-select
            label="Meta"
            v-model="metaSelected"
            :options="metaOptions"
            option-value="value"
          >
            <template v-slot:append>
              <q-btn @click="saveVariable()" flat icon="push_pin" />
            </template>
          </q-select>
        </template>
      </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Add" v-close-popup @click="selectVariable()" />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { VariableAttribute } from 'src/util/helper';

export type Formatter = 'bold' | 'italic' | 'underline' | 'strikeThrough' 
| 'justifyLeft' | 'justifyCenter' | 'justifyRight' | 'justifyFull' 
| 'insertUnorderedList' | 'insertOrderedList' | 'subscript' | 'superscript';

export interface VariableMeta {
  key: string,
  value: string
}
export interface Variable {
  id: string,
  alias: string,
  name: string,
  metas: VariableMeta[]
}
export type Toolbar = Array<Formatter[]>;
export interface ToolbarConfig {
  [key: string]: {
    label?: string;
    icon?: string;
  }
}
export interface SavedVariable {
  key: string,
  label: string
}

export interface ChapterEditorProps {
  modelValue: string,
  characters: Variable[],
  objects: Variable[],
  toolbars?: Toolbar,
  label?: string
}

enum VariableType {
  character = 'character',
  object = 'object'
}

const toolbarConfig: ToolbarConfig = {
  bold: {
    icon: 'format_bold'
  },
  italic: {
    icon: 'format_italic'
  },
  underline: {
    icon: 'format_underline'
  },
  strikeThrough: {
    icon: 'strikethrough_s'
  },
  justifyLeft: {
    icon: 'format_align_left'
  },
  justifyCenter: {
    icon: 'format_align_center'
  },
  justifyRight: {
    icon: 'format_align_right'
  },
  justifyFull: {
    icon: 'format_align_justify'
  },
  insertUnorderedList: {
    icon: 'format_align_justify'
  },
  insertOrderedList: {
    icon: 'lists'
  },
  subscript: {
    icon: 'subscript'
  },
  superscript: {
    icon: 'superscript'
  },
}

const props = withDefaults(defineProps<ChapterEditorProps>(), {
  modelValue: '<div>Type somethings</div>',
  characters: () => [],
  objects: () => [],
  toolbars: () => []
});
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const editor = ref<string>('');
const editorRawRef = ref<HTMLElement | null>(null);
const isShowCharacter = ref<boolean>(false);
const currentRange = ref<Range | null>(null);
const variableType = ref<string>(VariableType.character);
const variableSelected = ref<Variable | undefined>(undefined);
const metaSelected = ref<{ label: string, value: string } | undefined>(undefined);
const savedVariables = ref<SavedVariable[]>([]);

const metaOptions = computed<{ label: string, value: string }[]>(() => {
  if(variableSelected.value) {
    return variableSelected.value.metas.map(({ key, value }) => {
      return {
        label: key + ': ' + value,
        value: key
      }
    })
  }
  return [];
});

watch(variableSelected, () => {
  if(variableSelected.value) {
    metaSelected.value = undefined;
  }
});

watch(editor, () => {
  emits('update:modelValue', convertEditorContent(editor.value));
});

watch(editorRawRef, () => {
  if(editorRawRef.value) {
    editorRawRef.value.innerHTML = formatContentFromProps(props.modelValue);
    const observer = new MutationObserver((_, __) => {
      if (editorRawRef.value) {
        editor.value = formatContent(editorRawRef.value.innerHTML);
      }
    });
    observer.observe(editorRawRef.value, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }
});


watch(() => props.modelValue, () => {
  if(editorRawRef.value && props.modelValue != editor.value) {
    editorRawRef.value.innerHTML = formatContentFromProps(props.modelValue);
  }
});

watch(variableType, () => {
  variableSelected.value = undefined;
});

function handlePaste(e: ClipboardEvent) {
  if(e.clipboardData) {
    e.preventDefault();
    const doc = parseHTMLString(e.clipboardData.getData('text/html'));
    doc.querySelectorAll(`body *`).forEach(node => {
      for (let i = 0; i < node.attributes.length; i++) {
        console.log(node.attributes[i].name)
        if(!([VariableAttribute.content, VariableAttribute.variable] as string[]).includes(node.attributes[i].name)) {
          node.removeAttribute(node.attributes[i].name);
        }
      }
    });
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return;
    }
    selection.deleteFromDocument();
    const pasteRange = selection.getRangeAt(0);
    const nodeList: ChildNode[] = [];
    doc.body.childNodes.forEach(node => {
      nodeList.push(node);
    })
    nodeList.reverse().forEach(node => {
      pasteRange.insertNode(node)
    })
    selection.collapseToEnd();
  }
}

function parseHTMLString(content: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(content, 'text/html');
}

function formatContent(content: string): string {
  const doc = parseHTMLString(content);
  doc.body.querySelectorAll('[data-content]').forEach(node => {
    node.removeAttribute('data-content');
  });
  return doc.body.innerHTML;
}

function formatContentFromProps(content: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  doc.body.querySelectorAll('[data-variable]').forEach(node => {
    const variable = node.getAttribute('data-variable');
    if(variable != null) {
      node.setAttribute('data-content', findVariableValue(variable));
    }
  });
  return doc.body.innerHTML;
}

function convertEditorContent(content: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  doc.body.querySelectorAll(`[${VariableAttribute.content}]`).forEach(node => {
    node.removeAttribute(VariableAttribute.content);
  });
  return content;
}

function saveVariable() {
  if(variableSelected.value) {
    const variables = [
      variableType.value === VariableType.character ? 'character' : 'object',
      variableSelected.value.id
    ];
    if(metaSelected.value) {
      variables.push('meta');
      variables.push(metaSelected.value.value);
    }
    const variableKey = variables.join('.');
    if(!savedVariables.value.some(({ key }) => key === variableKey)) {
      savedVariables.value.push({
        key: variableKey,
        label: findVariableValue(variableKey)
      })
    }
  }
}

function btnBind(type: Formatter) {
  if(toolbarConfig[type]) {
    const toolbarProps = toolbarConfig[type];
    if(toolbarProps.icon) {
      return {
        icon: toolbarProps.icon
      }
    }
    return {
      label: toolbarProps.label || ''
    }
  } else {
    return {
      label: type
    }
  }
}

function format(type: Formatter) {
  document.execCommand(type, false);
}

function startToEdit() {
  const sel = window.getSelection();
  if(sel) {
    currentRange.value = sel.getRangeAt(0);
  }
  isShowCharacter.value = true;
}

function changeHtml(e: Event) {
  if (e.target instanceof Element) {
    editor.value = e.target.innerHTML;
  }
}

function selectVariable() {
  if(variableSelected.value) {
    const variables = [
      variableType.value === VariableType.character ? 'character' : 'object',
      variableSelected.value.id
    ];
    if(metaSelected.value) {
      variables.push('meta');
      variables.push(metaSelected.value.value);
    }
    addVariable(variables.join('.'));
  }
}

function addSavedVariable(variable: string) {
  const sel = window.getSelection();
  if(sel) {
    currentRange.value = sel.getRangeAt(0);
  }
  addVariable(variable);
}

function removeSavedVariable(variable: string) {
  savedVariables.value = savedVariables.value.filter(({ key }) => key !== variable);
}

function addVariable(variable: string) {
  const edit = editorRawRef.value;
  const name = findVariableValue(variable);
  const selection = window.getSelection();
  if(edit && currentRange.value && selection) {
    currentRange.value.deleteContents();
    const textNode = document.createTextNode('\u00a0');
    const element = document.createElement('span');
    element.innerHTML = ``;
    element.setAttribute(VariableAttribute.variable, variable);
    element.setAttribute(VariableAttribute.content, name);
    currentRange.value.insertNode(textNode);
    currentRange.value.insertNode(element);
    currentRange.value.setStartAfter(textNode);
    
    selection.removeAllRanges();
    selection.addRange(currentRange.value);
  }
}

function findVariableValue(variable: string): string {
  const parts = variable.split('.');
  if(parts.length > 1) {
    if(parts[0] === 'character') {
      if(parts.length > 2) {
        if(parts[2] === 'name') {
          return findCharacterValue(parts[1], true);
        } else if (parts.length > 3) {
          return findCharacterValue(parts[1], false, parts[3]);
        }
      }
    } else {
      if(parts[0] === 'object') {
        if(parts.length > 2) {
          if(parts[2] === 'name') {
            return findObjectValue(parts[1], true);
          } else if (parts.length > 3) {
            return findObjectValue(parts[1], false, parts[3]);
          }
        }
      }
    }
  }
  return '';
}

function findCharacterValue(id: string, name: boolean, meta?: string): string {
  const character = props.characters.find(item => item.id === id);
  if(character) {
    if(name) {
      return character.name;
    } else if(meta) {
      return character.metas.find(item => item.key == meta)?.value || '';
    }
  }
  return '';
}

function findObjectValue(id: string, name: boolean, meta?: string): string {
  const object = props.objects.find(item => item.id === id);
  if(object) {
    if(name) {
      return object.name;
    } else if(meta) {
      return object.metas.find(item => item.key == meta)?.value || '';
    }
  }
  return '';
}
</script>
<style lang="scss" scoped>
:deep([data-variable]) {
  border: 1px solid #333;
  padding: 3px;
  display: inline-block;
}
:deep([data-content]) {
  &::before {
    content: attr(data-content)
  }
}

.editor {
  border: 1px solid #333;
  min-height: 100px;
  max-height: 300px;
  overflow-y: scroll; 
  overflow: hidden;
  padding: 10px;
}
</style>