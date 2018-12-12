/**
 * 
 * Message:
 * 
 * This is a prototype of class method chaining that
 * builds a state object to be used to traverse a AST.
 * It does not do anything yet with an AST, it simply
 * is a proposed API layer to interact with one.
 * 
 */

enum RelationalOperator {
    DOUBLE_EQUALS = '==',
    TRIPPLE_EQUALS = '===',
    NOT_EQUAL = '!==',
    GREATER_THAN = '>',
    LESS_THAN = '<',
    GREATER_THAN_OR_EQUAL_TO = '>=',
    LESS_THAN_OR_EQUAL_TO = '<=',
}

enum DeclorationTypes {
    CONST = 'CONST',
    VAR = 'VAR',
    LET = 'LET',
}

enum PrimitaveTypes {
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    ARRAY = 'ARRAY',
    OBJECT = 'OBJECT',
    NULL = 'NULL',
    BOOLEAN = 'BOOLEAN',
    UNDEFINED = 'UNDEFINED',
    CLASS = 'CLASS',
    INSTANTIATED_CLASS = 'INSTANTIATED_CLASS',
}

enum FunctionTypes {
    ARROW_FUNCTION = 'ARROW_FUNCTION',
    NAMED_FUNCTION = 'NAMED_FUNCTION',
    ANONYMOUS_FUNCTION = 'ANONYMOUS_FUNCTION',
}

type AllTypes = FunctionTypes | PrimitaveTypes

interface Statement {
    DECLARE: DeclorationTypes,
    AS: AllTypes,
    NAMED: string | RegExp
    CHILD: CounselorNode | null
}

interface Store {
    MANDITORY_IMPORTS: string[],
    PROHIBITED_IMPORTS: string[],
    IMPORT_LIMIT: number | null,
    EXPORT_LIMIT: number | null,
    EXPORT_DEFAULT_ASSIGNED: string | RegExp | null,
}

class CounselorNode {
    nodeStore: {
        STATEMENTS: Statement[],
    }
    constructor () {
        this.nodeStore = {
            STATEMENTS: []
        }
    }
    declare (declare: DeclorationTypes) {
        return { as: (as: AllTypes) => this.as({ declare, as}) }
    }
    private as ({declare, as}: {declare: DeclorationTypes, as: AllTypes}) {
        return {
            named: (named: string | RegExp) => this.named({ declare, as, named }),
            namedOpen: (named: string | RegExp, callback: Function) => this.namedOpen({ declare, as, named, callback })
        }
    }
    private named ({declare, as, named}: {declare: DeclorationTypes, as: AllTypes, named: string | RegExp }) {
        this.nodeStore.STATEMENTS.push({
            DECLARE: declare,
            AS: as,
            NAMED: named,
            CHILD: null,
        });
        return this
    }
    private namedOpen (
        {declare, as, named, callback}:
        {declare: DeclorationTypes, as: AllTypes, named: string | RegExp, callback: Function}, 
    ) { 
        const counselor = new CounselorNode()
        const CHILD: CounselorNode = callback(counselor).advise()
        this.nodeStore.STATEMENTS.push({
            CHILD,
            DECLARE: declare,
            AS: as,
            NAMED: named,
        });
        return this
    }
    advise() {
        return this.nodeStore;
    }
}

class CounselorRoot extends CounselorNode{
    store: Store
    manditory: {
        import: CounselorRoot['manditoryImport']
        imports: CounselorRoot['manditoryImports']
    }
    prohibited: {
        import: CounselorRoot['prohibitedImport']
        imports: CounselorRoot['prohibitedImports']
    }
    import: {
        limit: CounselorRoot['importLimit']
    }
    export: {
        limit: CounselorRoot['exportLimit']
        default: {
            assigned: CounselorRoot['exportDefaultAssigned']
        }
    }
    constructor() {
        super()
        this.store = {
            MANDITORY_IMPORTS: [],
            PROHIBITED_IMPORTS: [],
            IMPORT_LIMIT: null,
            EXPORT_LIMIT: null,
            EXPORT_DEFAULT_ASSIGNED: null,
        }
        this.manditory = {
            import: this.manditoryImport.bind(this),
            imports: this.manditoryImports.bind(this)
        }
        this.prohibited = {
            import: this.prohibitedImport.bind(this),
            imports: this.prohibitedImports.bind(this)
        }
        this.import = {
            limit: this.importLimit.bind(this)
        }
        this.export = {
            limit: this.exportLimit.bind(this),
            default: {
                assigned: this.exportDefaultAssigned.bind(this)
            }
        }
    }
    private exportDefaultAssigned(named: string | RegExp) {
        this.store.EXPORT_DEFAULT_ASSIGNED = named;
        return this
    }
    private importLimit (limit: number): CounselorRoot {
        this.store.IMPORT_LIMIT = limit
        return this
    }
    private exportLimit (limit: number): CounselorRoot {
        this.store.EXPORT_LIMIT = limit
        return this
    }
    private manditoryImport (depencency: string): CounselorRoot {
        this.store.MANDITORY_IMPORTS = [...this.store.MANDITORY_IMPORTS, depencency];
        return this
    }
    private manditoryImports (dependencies: string[]): CounselorRoot {
        this.store.MANDITORY_IMPORTS = [...this.store.MANDITORY_IMPORTS, ...dependencies];
        return this
    }
    private prohibitedImport (depencency: string): CounselorRoot {
        this.store.PROHIBITED_IMPORTS = [...this.store.MANDITORY_IMPORTS, depencency];
        return this
    }
    private prohibitedImports (dependencies: string[]): CounselorRoot {
        this.store.PROHIBITED_IMPORTS = [...this.store.MANDITORY_IMPORTS, ...dependencies];
        return this
    }
    declare (declare: DeclorationTypes) {
        return super.declare.bind(this)(declare)
    }
    advise() {
        return {...this.store, ...this.nodeStore};
    }
}
