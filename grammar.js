module.exports = grammar({
  name: 'ak2',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  // ¡ESTO ES LO NUEVO! Le decimos cómo resolver la duda con el import
  conflicts: $ => [
    [$.import_statement]
  ],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.import_statement,
      $.arrow_statement,
      $.component,
      $.property,
      $.reference,
      $.string
    ),

    import_statement: $ => seq(
      'import',
      optional($.string),
      optional(';')
    ),

    arrow_statement: $ => seq(
      $.identifier,
      '<-',
      $._item
    ),

    component: $ => seq(
      field('type', $.identifier), 
      optional(seq('(', field('id', $.identifier), ')')),
      '{',
      repeat($._item),
      '}',
      optional(';')
    ),

    property: $ => seq(
      field('key', $.identifier),
      ':',
      '[',
      repeat($._item),
      ']',
      optional(choice(';', ','))
    ),

    reference: $ => seq(
      '(',
      field('name', $.identifier),
      ')',
      optional(';')
    ),

    identifier: $ => /[a-z][a-z0-9_]+(-[a-z][a-z0-9_]+)*/,

    string: $ => /"[^"\\]*(?:\\.[^"\\]*)*"/,

    line_comment: $ => /\/\/[^\n]*/,
    
    block_comment: $ => /\/\*[\s\S]*?\*\//
  }
});