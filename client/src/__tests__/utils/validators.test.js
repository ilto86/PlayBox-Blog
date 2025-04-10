import { isValidEmail, isValidPassword } from '../../utils/validators';

// Групираме тестовете за този модул
describe('Utils: validators', () => {

    // Под-група за функцията isValidEmail
    describe('isValidEmail', () => {
        // 'it' описва конкретен сценарий или очакван резултат
        it('should return true for valid email addresses', () => {
            // 'expect' прави твърдение (assertion) за резултата
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
            // Проверка с домейни от твоя списък
            expect(isValidEmail('test@abv.bg')).toBe(true);
            expect(isValidEmail('test@gmail.com')).toBe(true);
            expect(isValidEmail('test@mail.bg')).toBe(true);
        });

        it('should return false for invalid email addresses', () => {
            expect(isValidEmail('')).toBe(false); // Празна стойност
            expect(isValidEmail('test')).toBe(false); // Липсва @ и домейн
            expect(isValidEmail('test@')).toBe(false); // Липсва домейн
            expect(isValidEmail('@domain.com')).toBe(false); // Липсва локална част
            expect(isValidEmail('test@domain')).toBe(false); // Липсва .tld
            expect(isValidEmail('test@domain.')).toBe(false); // Не завършва правилно
            expect(isValidEmail('test @domain.com')).toBe(false); // Интервал
            expect(isValidEmail('test@invalid-domain')).toBe(false); // Невалиден домейн (без .tld)
            expect(isValidEmail(null)).toBe(false); // null стойност
            expect(isValidEmail(undefined)).toBe(false); // undefined стойност
        });

        // Добавяме тест за домейни, които НЕ са в списъка (ако логиката го изисква)
        // Ако твоята функция isValidEmail проверява САМО формата, а не дали домейнът е в списъка,
        // този тест може да не е нужен или да трябва да се адаптира.
        // Ако обаче функцията изисква домейнът да е от списъка, този тест е важен.
        // --- Начало на проверка на домейн ---
        // it('should return false for valid format emails with domains NOT in the popular list', () => {
        //     expect(isValidEmail('test@unknown-domain.xyz')).toBe(false);
        // });
        // --- Край на проверка на домейн ---
        // Моля, прегледай твоята имплементация на isValidEmail, за да видиш дали проверява списъка с домейни.
        // Ако да, разкоментирай горния тест. Ако не, можеш да го изтриеш.
    });

    // Под-група за функцията isValidPassword
    describe('isValidPassword', () => {
        it('should return true for passwords with 6 or more characters (non-admin email)', () => {
            expect(isValidPassword('123456', 'test@example.com')).toBe(true);
            expect(isValidPassword('longpassword', 'another@domain.net')).toBe(true);
        });

        it('should return false for passwords with less than 6 characters (non-admin email)', () => {
            expect(isValidPassword('12345', 'test@example.com')).toBe(false);
            expect(isValidPassword('', 'test@example.com')).toBe(false); // Празна парола
        });

        it('should return false if password is null or undefined', () => {
            expect(isValidPassword(null, 'test@example.com')).toBe(false);
            expect(isValidPassword(undefined, 'test@example.com')).toBe(false);
        });

        it('should return false if email is not provided or invalid', () => {
             // Функцията изисква валиден email, за да провери за admin случая
            expect(isValidPassword('123456', '')).toBe(false);
            expect(isValidPassword('123456', null)).toBe(false);
            expect(isValidPassword('123456', undefined)).toBe(false);
             // Може да добавиш и тест с невалиден email формат, ако искаш да си стриктен
             // expect(isValidPassword('123456', 'invalid-email')).toBe(false);
        });

        // Специален случай за admin@abv.bg
        it('should return true for admin@abv.bg regardless of password length', () => {
             // Този тест предполага, че специалната логика за admin@abv.bg все още съществува
            expect(isValidPassword('123', 'admin@abv.bg')).toBe(true);
            expect(isValidPassword('short', 'admin@abv.bg')).toBe(true);
            expect(isValidPassword('anypassword', 'admin@abv.bg')).toBe(true);
             expect(isValidPassword('', 'admin@abv.bg')).toBe(true); // Дори празна парола е true за админ? Провери логиката!
        });

        it('should handle case-insensitivity for admin email check', () => {
            expect(isValidPassword('123', 'Admin@abv.bg')).toBe(true);
            expect(isValidPassword('123', 'ADMIN@ABV.BG')).toBe(true);
        });
    });
}); 