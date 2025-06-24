import type { Rule } from 'rc-field-form/lib/interface';
// utils/formRules.ts

export const smRegex = {
    alphabetic: {
        pattern: /^[a-zA-Z]+$/,
        message: '영문자만 입력하세요',
    },
    alphalower: {
        pattern: /^[a-z]+$/,
        message: '영소문자만 입력하세요',
    },
    alphaupper: {
        pattern: /^[A-Z]+$/,
        message: '영대문자만 입력하세요',
    },
    alphanumeric: {
        pattern: /^[a-zA-Z\d]+$/,
        message: '영문자 또는 숫자만 입력하세요',
    },
    phone: {
        pattern: /^[\-?\d]+$/,
        message: '숫자 대시만 입력하세요',
    },
    nowhitespace: {
        pattern: /^\S+$/,
        message: '공백문자는 입력할 수 없습니다',
    },
    directory: {
        pattern: /^[\/?a-z]+$/,
        message: '영문자 슬래시만 입력하세요',
    },
    telephone: {
        pattern: /^(02|0[3-9]{1}[0-9]{1,2})-[0-9]{3,4}-[0-9]{4}$/,
        message: '[02-111-2222] 형식으로 입력하세요',
    },
    mobile: {
        pattern: /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/,
        message: '[010-1111-2222] 형식으로 입력하세요',
    },
    zipcode: {
        pattern: /^\d{3}-\d{3}$/,
        message: '[000-111] 형식으로 입력하세요',
    },
    time: {
        pattern: /^(([0-1]?[0-2])|([2][0-3])):([0-5]?[0-9]):([0-5]?[0-9])?$/,
        message: '시분초 형식으로 입력하세요',
    },
    code: {
        pattern: /^[A-Z_]+$/,
        message: '영대문자 언더바만 입력하세요',
    },
};

// 필수
export const smRequired = (isRequired = true, message?: string): Rule | undefined =>
    isRequired ? { required: true, message: message } : undefined;

// 최소 길이
export const smMin = (min: number, message?: string): Rule => ({
    min,
    message: message,
});

// 최대 길이
export const smMax = (max: number, message?: string): Rule => ({
    max,
    message: message,
});

// 지정 길이
export const smLen = (len: number, message?: string): Rule => ({
    len,
    message: message,
});

// 정규식
export const smPattern = (regex: RegExp, message: string): Rule => ({
    pattern: regex,
    message,
});

export function smValidateBuilder(...rules: Array<Rule | undefined>): Rule[] {
    return rules.filter((r): r is Rule => !!r); // undefined 제거
}
